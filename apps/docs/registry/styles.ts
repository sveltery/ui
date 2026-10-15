import { declarations, parseCss, type CssNode } from './css';
import type { StyleName } from './types';

export type StyleSheet = {
  /** `cn-*` token to the utilities its rules apply, space separated, in file order. */
  utilities: Map<string, string>;
  /** `--ui-radius-<size>` declarations, keyed by size (`sm`, `md`, ...). */
  radii: Map<string, string>;
};

const TOKEN_RULE = /^\.(cn-[a-z0-9-]+)(?::has\((.+)\))?$/;

/** `:has(> [data-x])` becomes the Tailwind variant `has-[>_[data-x]]:`. */
const hasVariant = (selector: string) => `has-[${selector.trim().replace(/\s+/g, '_')}]:`;

/**
 * Reads `styles/scoped/<style>.css`. The layout is fixed, so each node is matched against the one
 * shape it can have and anything else throws, so a rule is never dropped silently.
 */
export function parseStyleSheet(css: string, style: StyleName): StyleSheet {
  const file = `styles/scoped/${style}.css`;
  const scope = `.style-${style}.style-${style}`;
  const sheet: StyleSheet = { utilities: new Map(), radii: new Map() };

  function reject(what: string): never {
    throw new Error(`${file}: unsupported ${what}`);
  }

  function applied(selector: string, nodes: CssNode[]) {
    const [only, ...extra] = nodes;
    if (only?.kind !== 'at' || only.name !== 'apply' || only.children || extra.length) reject(`rule body for ${selector}`);
    return only.prelude.split(/\s+/).filter(Boolean);
  }

  const tokenRule = (node: Extract<CssNode, { kind: 'rule' }>) => {
    const match = TOKEN_RULE.exec(node.selector);
    if (!match) return reject(`selector ${node.selector}`);
    const [, token = '', qualifier] = match;
    const utilities = applied(node.selector, node.children);
    const mapped = qualifier ? utilities.map((utility) => hasVariant(qualifier) + utility) : utilities;
    const previous = sheet.utilities.get(token);
    sheet.utilities.set(token, [previous, ...mapped].filter(Boolean).join(' '));
  };

  const scopeBody = (nodes: CssNode[]) => {
    for (const node of nodes) {
      if (node.kind === 'rule') tokenRule(node);
      else if (node.kind === 'decl' && node.prop.startsWith('--ui-radius-')) sheet.radii.set(node.prop.slice('--ui-radius-'.length), node.value);
      else reject(node.kind === 'decl' ? `declaration ${node.prop}` : `at-rule @${node.name}`);
    }
  };

  const components = (nodes: CssNode[]) => {
    for (const node of nodes) {
      if (node.kind !== 'rule') reject('node in @layer components');
      else if (node.selector === scope) scopeBody(node.children);
      else if (node.selector.startsWith(`${scope} :is(`) && declarations(node.children).length === node.children.length) continue;
      else reject(`selector ${node.selector}`);
    }
  };

  for (const node of parseCss(css, file)) {
    if (node.kind === 'at' && (node.name === 'import' || node.name === 'custom-variant')) continue;
    if (node.kind === 'at' && node.name === 'layer' && node.prelude === 'base' && node.children?.every((rule) => rule.kind === 'rule' && rule.selector === `:where(.style-${style}) *`)) continue;
    if (node.kind === 'at' && node.name === 'layer' && node.prelude === 'components' && node.children) components(node.children);
    else reject(node.kind === 'at' ? `at-rule @${node.name} ${node.prelude}` : `top-level ${node.kind}`);
  }
  return sheet;
}
