import { parseCss, type CssNode } from './css';
import { styleNames, type StyleName } from './types';

export type StyleSheet = {
  /** `cn-*` token to the utilities its rules apply, space separated, in file order. */
  utilities: Map<string, string>;
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
  const scope = `.style-${style}`;
  const sheet: StyleSheet = { utilities: new Map() };

  function reject(what: string): never {
    throw new Error(`${file}: unsupported ${what}`);
  }

  function applied(selector: string, nodes: CssNode[]) {
    const [only, ...extra] = nodes;
    if (!only) return [];
    if (only.kind !== 'at' || only.name !== 'apply' || only.children || extra.length) reject(`rule body for ${selector}`);
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

  for (const node of parseCss(css, file)) {
    if (node.kind !== 'rule' || node.selector !== scope) reject(node.kind === 'at' ? `at-rule @${node.name} ${node.prelude}` : `top-level ${node.kind} ${node.kind === 'rule' ? node.selector : node.prop}`);
    for (const child of node.children) {
      if (child.kind === 'rule') tokenRule(child);
      else reject(child.kind === 'decl' ? `declaration ${child.prop}` : `at-rule @${child.name}`);
    }
  }
  return sheet;
}

/**
 * `@source inline()` naming every utility the sheets apply. The docs inline them into components as Vite loads
 * each module, so Tailwind's scan of the source files never sees them.
 */
export function utilitiesSource(sheets: Record<StyleName, string>) {
  const utilities = styleNames.flatMap((style) => [...parseStyleSheet(sheets[style], style).utilities.values()].flatMap((list) => list.split(' ')));
  return `@source inline("${[...new Set(utilities)].filter(Boolean).sort().join(' ')}");\n`;
}
