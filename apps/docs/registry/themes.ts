import { declarations, parseCss, type CssNode } from './css';
import { baseColors, type BaseColor, type CssVars } from './types';

const FILE = 'styles/themes.css';

const vars = (nodes: CssNode[]) => Object.fromEntries(declarations(nodes).map((decl) => [decl.prop, decl.value]));

/**
 * Reads `styles/themes.css` into one `cssVars` per base color. The docs app gets `--radius-*` from
 * a style's `--ui-radius-*` scale, but a project that copied the components has no such scale, so
 * the `theme` block carries the scale itself.
 */
export function parseThemes(css: string, radii: ReadonlyMap<string, string>): Record<BaseColor, CssVars> {
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
  const sizes = Object.keys(theme).flatMap((prop) => (prop.startsWith('--radius-') ? [prop.slice('--radius-'.length)] : []));
  if (sizes.length !== radii.size || sizes.some((size) => !radii.has(size))) {
    throw new Error(`${FILE}: @theme sets --radius-${sizes.join(', ')} but the styles set --ui-radius-${[...radii.keys()].join(', ')}`);
  }
  for (const size of sizes) theme[`--radius-${size}`] = radii.get(size)!;

  return Object.fromEntries(
    baseColors.map((color) => {
      const light = block(`.theme-${color}`);
      light['--radius'] ??= rootRadius;
      return [color, { theme: { ...theme }, light, dark: block(`.dark.theme-${color}, .dark .theme-${color}`) }];
    }),
  ) as Record<BaseColor, CssVars>;
}
