import { twMerge } from 'cn';
import postcss, { type AtRule, type ChildNode, type Container, type Root, type Rule } from 'postcss';
import { CliError } from './parse.js';
import type { CssTree, CssVars, RegistryItem } from './registry.js';
import { cliPackage } from './version.js';

const importTarget = (node: ChildNode) => (node.type === 'atrule' && node.name === 'import' ? node.params.trim().split(/\s+/)[0]?.replace(/^url\((.*)\)$/, '$1').replace(/^["']|["']$/g, '') : undefined);

export const importsTailwind = (css: string) => /@import\s+(["'])tailwindcss\1/.test(css);

/** Indentation for a child of `parent`, matching the file's existing children where there are any. */
function childBefore(parent: Container): string {
  const sibling = parent.nodes?.find((node) => node.raws.before?.includes('\n'));
  if (sibling?.raws.before) return sibling.raws.before.replace(/^\n+/, '\n');
  let depth = 0;
  for (let node: Container | undefined = parent; node && node.type !== 'root'; node = node.parent as Container | undefined) depth++;
  let unit = '  ';
  parent.root().walkDecls((decl) => {
    const indent = decl.parent?.parent?.type === 'root' ? /\n([ \t]+)$/.exec(decl.raws.before ?? '')?.[1] : undefined;
    if (!indent) return;
    unit = indent;
    return false;
  });
  return `\n${unit.repeat(depth)}`;
}

function append<T extends ChildNode>(parent: Container, node: T): T {
  node.raws.before = parent.type === 'root' ? '\n' : childBefore(parent);
  if (node.type === 'rule' || node.type === 'atrule') {
    node.raws.between = node.nodes ? ' ' : '';
    if (node.type === 'atrule') node.raws.afterName = ' ';
    node.raws.semicolon = true;
    node.raws.after = `\n${(node.raws.before ?? '').replace(/^\n+/, '')}`;
  }
  parent.append(node);
  return node;
}

function ensureRule(parent: Container, selector: string): Rule {
  return (parent.nodes?.find((node): node is Rule => node.type === 'rule' && node.selector === selector) ??
    append(parent, postcss.rule({ selector, nodes: [] })));
}

function ensureAtRule(parent: Container, name: string, params: string): AtRule {
  return (parent.nodes?.find((node): node is AtRule => node.type === 'atrule' && node.name === name && node.params.trim() === params) ??
    append(parent, postcss.atRule({ name, params, nodes: [] })));
}

/** Sets a declaration in place, or appends it. A value that already matches is left untouched. */
function setDecl(container: Container, prop: string, value: string) {
  const existing = container.nodes?.find((node) => node.type === 'decl' && node.prop === prop);
  if (existing?.type === 'decl') {
    if (existing.value !== value) existing.value = value;
  } else append(container, postcss.decl({ prop, value }));
}

const setVars = (container: Container, vars: Record<string, string> | undefined) =>
  Object.entries(vars ?? {}).forEach(([key, value]) => setDecl(container, key.startsWith('--') ? key : `--${key}`, value));

/** Merges the utilities into the rule's `@apply` with twMerge, as upstream does, so a new font class replaces the old one. */
function ensureApply(parent: Container, utilities: string) {
  const existing = parent.nodes?.find((node): node is AtRule => node.type === 'atrule' && node.name === 'apply');
  if (!existing) append(parent, postcss.atRule({ name: 'apply', params: utilities }));
  else if (existing.params.trim() !== utilities) existing.params = twMerge(existing.params, utilities);
}

/** The imports and base layer every Sveltery project needs. */
export const DEFAULT_CSS: CssTree = {
  '@import "tw-animate-css"': {},
  [`@import "${cliPackage}/tailwind.css"`]: {},
  '@layer base': {
    '*': { '@apply border-border outline-ring/50': {} },
    body: { '@apply bg-background text-foreground': {} },
  },
};

const importOf = (key: string) => /^@import\s+["']?([^"'\s]+)["']?$/.exec(key)?.[1];

/** Writes a tree as shadcn's `css` field means it: a string is a declaration, `@apply` keys apply utilities, and other keys are at-rules or rules to find or create. */
function applyTree(parent: Container, tree: CssTree) {
  for (const [key, value] of Object.entries(tree)) {
    if (importOf(key) !== undefined) continue;
    if (Array.isArray(value)) throw new CliError(`Cannot merge the css entry "${key}": arrays are not supported.`);
    if (typeof value === 'string') setDecl(parent, key, value);
    else if (key.startsWith('@apply ')) ensureApply(parent, key.slice('@apply '.length).trim());
    else if (key.startsWith('@')) {
      const [, name = '', params = ''] = /^@(\S+)\s*(.*)$/.exec(key) ?? [];
      applyTree(ensureAtRule(parent, name, params), value);
    } else applyTree(ensureRule(parent, key), value);
  }
}

/**
 * Merges the trees' imports, a dark variant, the theme tokens, then the rest of each tree into a stylesheet that imports Tailwind.
 * Running it on its own output returns the same string.
 */
export function mergeTheme(css: string, cssVars: CssVars, trees: CssTree[]): string {
  const root: Root = postcss.parse(css);
  const tailwind = root.nodes.find((node) => importTarget(node) === 'tailwindcss');
  if (tailwind?.type !== 'atrule') throw new Error('The stylesheet does not import tailwindcss.');
  const quote = tailwind.params.trim().startsWith("'") ? "'" : '"';
  const lastImport = () => root.nodes.filter((node) => node.type === 'atrule' && node.name === 'import').at(-1)!;

  for (const target of trees.flatMap((tree) => Object.keys(tree).flatMap((key) => importOf(key) ?? []))) {
    if (root.nodes.some((node) => importTarget(node) === target)) continue;
    lastImport().after(postcss.atRule({ name: 'import', params: `${quote}${target}${quote}`, raws: { before: '\n', afterName: ' ' } }));
  }

  if (!root.nodes.some((node) => node.type === 'atrule' && node.name === 'custom-variant' && node.params.trim().startsWith('dark '))) {
    lastImport().after(postcss.atRule({ name: 'custom-variant', params: 'dark (&:is(.dark *))', raws: { before: '\n', afterName: ' ' } }));
  }

  setVars(ensureRule(root, ':root'), cssVars.light);
  setVars(ensureRule(root, '.dark'), cssVars.dark);
  setVars(ensureAtRule(root, 'theme', 'inline'), cssVars.theme);
  for (const tree of trees) applyTree(root, tree);

  return root.toString();
}

const ROOT_FONT_CLASSES = ['font-sans', 'font-serif', 'font-mono'];

/** Port of shadcn's `massageTreeForFonts` for projects that are not Next.js: fontsource imports, the theme variables, and a root font class on `html`. */
export function fontStyles(items: RegistryItem[]): { theme: Record<string, string>; css: CssTree; dependencies: string[] } {
  const theme: Record<string, string> = {};
  const css: CssTree = {};
  const dependencies: string[] = [];
  const classesBySelector = new Map<string, string[]>();
  for (const item of items) {
    if (item.type !== 'registry:font') continue;
    const { font } = item;
    const dependency = font.dependency ?? `@fontsource-variable/${item.name.replace('font-', '')}`;
    dependencies.push(dependency);
    css[`@import "${dependency}"`] = {};
    theme[font.variable] = font.family;
    const utility = font.variable.slice('--'.length);
    const selector = font.selector ?? (ROOT_FONT_CLASSES.includes(utility) ? 'html' : undefined);
    if (selector) classesBySelector.set(selector, [...(classesBySelector.get(selector) ?? []), utility]);
  }
  css['@layer base'] = Object.fromEntries([...classesBySelector].map(([selector, classes]) => [selector, { [`@apply ${classes.join(' ')}`]: {} }]));
  return { theme, css, dependencies };
}
