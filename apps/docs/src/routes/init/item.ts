import { buildTheme, PRESET_FONT_DEFINITIONS, type PresetCssVars, type ThemeColors } from '../../../../../packages/cli/src/preset/index.js';
import cli from '../../../../../packages/cli/package.json';
import { iconLibraries } from '../../../../../packages/cli/src/icons';
import type { CssTree, RegistryItem } from '../../../registry/types';
import type { InitConfig, InitPart, InitRequest } from './query';

/** What the CLI's `init` installs for every project, as caret ranges of the versions apps/docs/package.json pins. */
const BASE_DEPENDENCIES = ['cn@^0.2.2', 'class-variance-authority@^0.7.1', 'tw-animate-css@^1.4.0'];

const POINTER_CURSOR_SELECTOR = 'button:not(:disabled), [role="button"]:not(:disabled)';

const headingFont = (config: InitConfig) => (config.fontHeading === config.font ? 'inherit' : config.fontHeading);

/** The theme vars without the `font-heading` var that `buildTheme` adds for an inherited heading, which belongs to the font part. */
function themeVars(config: InitConfig, colors: ThemeColors): PresetCssVars {
  const vars = buildTheme(config, colors);
  delete vars.theme?.['font-heading'];
  return vars;
}

function fontPart(config: InitConfig) {
  const heading = headingFont(config);
  return {
    registryDependencies: [`font-${config.font}`, ...(heading === 'inherit' ? [] : [`font-heading-${heading}`])],
    theme: heading === 'inherit' ? { 'font-heading': `var(${PRESET_FONT_DEFINITIONS[config.font].variable})` } : {},
  };
}

/** Port of shadcn's `buildRegistryBase` and `buildPartialRegistryBase`, with sveltery's packages in place of shadcn's. The CLI package's name follows its package.json. */
export function buildInitItem({ config, pointer, parts }: InitRequest, colors: ThemeColors, origin: string): RegistryItem {
  const want = (part: InitPart) => !parts || parts.includes(part);
  const theme = want('theme') ? themeVars(config, colors) : undefined;
  const font = want('font') ? fontPart(config) : undefined;
  const themeBlock = { ...theme?.theme, ...font?.theme };
  const cssVars = {
    ...(Object.keys(themeBlock).length > 0 && { theme: themeBlock }),
    ...(theme && { light: theme.light, dark: theme.dark }),
  };
  const common = { $schema: `${origin}/schema/registry-item.json`, type: 'registry:base' as const, files: [] };

  if (parts) {
    return {
      ...common,
      name: `${config.style}-${parts.join('-')}`,
      ...(theme && { config: { menuColor: config.menuColor, menuAccent: config.menuAccent, tailwind: { baseColor: config.baseColor } } }),
      ...(font && { registryDependencies: font.registryDependencies }),
      ...(Object.keys(cssVars).length > 0 && { cssVars }),
    };
  }

  const css: CssTree = {
    '@import "tw-animate-css"': {},
    [`@import "${cli.name}/tailwind.css"`]: {},
    '@layer base': {
      '*': { '@apply border-border outline-ring/50': {} },
      body: { '@apply bg-background text-foreground': {} },
      ...(pointer && { [POINTER_CURSOR_SELECTOR]: { cursor: 'pointer' } }),
    },
  };
  return {
    ...common,
    name: config.style,
    config: {
      style: config.style,
      iconLibrary: config.iconLibrary,
      menuColor: config.menuColor,
      menuAccent: config.menuAccent,
      tailwind: { baseColor: config.baseColor },
    },
    dependencies: [`${cli.name}@latest`, ...BASE_DEPENDENCIES, ...iconLibraries[config.iconLibrary].packages],
    registryDependencies: font?.registryDependencies,
    cssVars,
    css,
  };
}
