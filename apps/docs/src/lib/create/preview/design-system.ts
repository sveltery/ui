// Port of shadcn's apps/v4/app/(app)/(create)/components/design-system-provider.tsx at af983e8.
import { buildTheme, PRESET_FONT_DEFINITIONS, type PresetConfig, type PresetCssVars, type PresetMenuColor, type PresetRadius, type PresetTheme, type ThemeColors } from '../../../../../../packages/cli/src/preset/index.js';
import { loadFont } from './fonts';

type ColorVars = NonNullable<ThemeColors[PresetTheme]>;

const THEME_STYLE_ID = 'design-system-theme-vars';

const colorRequests = new Map<PresetTheme, Promise<ColorVars>>();

function fetchColors(name: PresetTheme): Promise<ColorVars> {
  let request = colorRequests.get(name);
  if (!request) {
    request = fetch(`/r/themes/${name}.json`).then(async (response) => {
      if (!response.ok) throw new Error(`Theme "${name}" is not in the registry (${response.status})`);
      return ((await response.json()) as { cssVars: ColorVars }).cssVars;
    });
    request.catch(() => colorRequests.delete(name));
    colorRequests.set(name, request);
  }
  return request;
}

async function loadColors(config: PresetConfig): Promise<ThemeColors | null> {
  const names = [...new Set([config.baseColor, config.theme, config.chartColor ?? config.theme])];
  try {
    return Object.fromEntries(await Promise.all(names.map(async (name) => [name, await fetchColors(name)])));
  } catch (error) {
    console.error(error);
    return null;
  }
}

/** The radius each style allows, as upstream's preview forces it. */
export function constrainRadius({ style, radius }: Pick<PresetConfig, 'style' | 'radius'>): PresetRadius {
  if (style === 'lyra' || style === 'sera') return 'none';
  if (style === 'rhea' && radius === 'large') return 'default';
  return radius;
}

function cssRule(selector: string, vars: Record<string, string> = {}): string {
  const declarations = Object.entries(vars)
    .filter(([, value]) => value)
    .map(([key, value]) => `  --${key}: ${value};\n`)
    .join('');
  return `${selector} {\n${declarations}}\n`;
}

function writeThemeVars(vars: PresetCssVars): void {
  let element = document.getElementById(THEME_STYLE_ID);
  if (!element) {
    element = document.createElement('style');
    element.id = THEME_STYLE_ID;
    document.head.append(element);
  }
  element.textContent = cssRule(':root', { ...vars.theme, ...vars.light }) + cssRule('.dark', vars.dark);
}

/**
 * Loads the colors and fonts a config needs, then returns a function that applies all of it at once. Applying only
 * after everything has loaded keeps the preview from showing a half-applied config.
 */
export async function prepareDesignSystem(config: PresetConfig): Promise<() => void> {
  const body = PRESET_FONT_DEFINITIONS[config.font];
  const heading = config.fontHeading === 'inherit' ? body : PRESET_FONT_DEFINITIONS[config.fontHeading];
  const fonts = config.fontHeading === 'inherit' ? [config.font] : [config.font, config.fontHeading];
  // A font that fails to load falls back to the next family in its stack, so it does not hold up the rest.
  const [colors] = await Promise.all([loadColors(config), ...fonts.map((font) => loadFont(font).catch(console.error))]);

  return () => {
    const classes = document.body.classList;
    for (const name of [...classes]) if (name.startsWith('style-')) classes.remove(name);
    classes.add(`style-${config.style}`);

    // The preview always sets --font-sans, whatever the font's type, so the chosen font shows.
    const root = document.documentElement.style;
    root.setProperty('--font-sans', body.family);
    root.setProperty('--font-heading', heading.family);

    if (colors) writeThemeVars(buildTheme({ ...config, radius: constrainRadius(config) }, colors));
  };
}

const MENU_SELECTOR = '.cn-menu-target, [data-menu-translucent]';

/** Applies the menu color to every menu surface, including ones that mount later. Returns the cleanup. */
export function syncMenuColor(menuColor: PresetMenuColor): () => void {
  const inverted = menuColor === 'inverted' || menuColor === 'inverted-translucent';
  const translucent = menuColor === 'default-translucent' || menuColor === 'inverted-translucent';

  const update = () => {
    const elements = document.querySelectorAll<HTMLElement>(MENU_SELECTOR);
    if (elements.length === 0) return;
    // A transition would animate the color change on menus that are already open.
    for (const element of elements) element.style.transition = 'none';
    for (const element of elements) {
      if (element.classList.contains('cn-menu-target')) element.classList.toggle('dark', inverted);
      // A non-translucent menu keeps a data attribute so a later switch back can find it.
      if (translucent) {
        element.classList.add('cn-menu-translucent');
        element.removeAttribute('data-menu-translucent');
      } else if (element.classList.contains('cn-menu-translucent')) {
        element.classList.remove('cn-menu-translucent');
        element.setAttribute('data-menu-translucent', '');
      }
    }
    // Force a reflow so the classes apply before transitions come back.
    void document.body.offsetHeight;
    for (const element of elements) element.style.transition = '';
  };

  let frame = 0;
  const observer = new MutationObserver(() => {
    frame ||= requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  });
  update();
  observer.observe(document.body, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
  };
}
