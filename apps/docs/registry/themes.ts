import { declarations, parseCss, type CssNode } from './css';
import { accentColors, baseColors, type AccentColor, type BaseColor, type CssVars } from './types';

const FILE = 'styles/themes.css';

// shadcn's cssVars keys leave out the leading `--`; the installer adds it back.
const unprefixed = (vars: Record<string, string>) => Object.fromEntries(Object.entries(vars).map(([name, value]) => [name.replace(/^--/, ''), value]));

const vars = (nodes: CssNode[]) => Object.fromEntries(declarations(nodes).map((decl) => [decl.prop, decl.value]));

/**
 * Reads `styles/themes.css` into one `cssVars` per base color. An accent carries only the `light`
 * and `dark` vars it overrides, as upstream's accent themes do.
 */
export function parseThemes(css: string): Record<BaseColor | AccentColor, CssVars> {
  const nodes = parseCss(css, FILE);
  const rules = new Map(nodes.flatMap((node) => (node.kind === 'rule' ? [[node.selector, node.children] as const] : [])));
  const themeBlock = nodes.find((node) => node.kind === 'at' && node.name === 'theme' && node.prelude === 'inline');
  if (themeBlock?.kind !== 'at' || !themeBlock.children) throw new Error(`${FILE}: no @theme inline block`);
  const block = (selector: string) => {
    const children = rules.get(selector);
    if (!children) throw new Error(`${FILE}: no ${selector} block`);
    return vars(children);
  };

  const rootRadius = block(':root')['--radius'];
  if (!rootRadius) throw new Error(`${FILE}: :root has no --radius`);

  const theme = vars(themeBlock.children);

  const dark = (color: string) => unprefixed(block(`.dark.theme-${color}, .dark .theme-${color}`));
  const bases = baseColors.map((color) => {
    const light = block(`.theme-${color}`);
    light['--radius'] ??= rootRadius;
    return [color, { theme: unprefixed(theme), light: unprefixed(light), dark: dark(color) }];
  });
  const accents = accentColors.map((color) => [color, { light: unprefixed(block(`.theme-${color}`)), dark: dark(color) }]);
  return Object.fromEntries([...bases, ...accents]) as Record<BaseColor | AccentColor, CssVars>;
}
