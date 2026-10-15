import postcss, { type AtRule, type ChildNode, type Container, type Root, type Rule } from 'postcss';
import type { CssVars } from './registry.js';

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

/** Updates each variable in place, appending the missing ones. Values that already match are left untouched. */
function setVars(container: Container, vars: Record<string, string> | undefined) {
  for (const [key, value] of Object.entries(vars ?? {})) {
    const prop = key.startsWith('--') ? key : `--${key}`;
    const existing = container.nodes?.find((node) => node.type === 'decl' && node.prop === prop);
    if (existing?.type === 'decl') {
      if (existing.value !== value) existing.value = value;
    } else append(container, postcss.decl({ prop, value }));
  }
}

function ensureApply(rule: Rule, utilities: string) {
  if (!rule.nodes.some((node) => node.type === 'atrule' && node.name === 'apply' && node.params.trim() === utilities)) {
    append(rule, postcss.atRule({ name: 'apply', params: utilities }));
  }
}

/**
 * Merges Sveltery's imports, dark variant, theme tokens and base layer into a stylesheet that imports Tailwind.
 * Running it on its own output returns the same string.
 */
export function mergeTheme(css: string, cssVars: CssVars): string {
  const root: Root = postcss.parse(css);
  const tailwind = root.nodes.find((node) => importTarget(node) === 'tailwindcss');
  if (tailwind?.type !== 'atrule') throw new Error('The stylesheet does not import tailwindcss.');
  const quote = tailwind.params.trim().startsWith("'") ? "'" : '"';

  let anchor: ChildNode = tailwind;
  for (const target of ['tw-animate-css', 'sveltery/tailwind.css']) {
    const existing = root.nodes.find((node) => importTarget(node) === target);
    if (existing) {
      anchor = existing;
      continue;
    }
    const node = postcss.atRule({ name: 'import', params: `${quote}${target}${quote}`, raws: { before: '\n', afterName: ' ' } });
    anchor.after(node);
    anchor = node;
  }

  if (!root.nodes.some((node) => node.type === 'atrule' && node.name === 'custom-variant' && node.params.trim().startsWith('dark '))) {
    const lastImport = root.nodes.filter((node) => node.type === 'atrule' && node.name === 'import').at(-1) ?? anchor;
    lastImport.after(postcss.atRule({ name: 'custom-variant', params: 'dark (&:is(.dark *))', raws: { before: '\n', afterName: ' ' } }));
  }

  setVars(ensureRule(root, ':root'), cssVars.light);
  setVars(ensureRule(root, '.dark'), cssVars.dark);
  setVars(ensureAtRule(root, 'theme', 'inline'), cssVars.theme);

  const base = ensureAtRule(root, 'layer', 'base');
  ensureApply(ensureRule(base, '*'), 'border-border outline-ring/50');
  ensureApply(ensureRule(base, 'body'), 'bg-background text-foreground');

  return root.toString();
}
