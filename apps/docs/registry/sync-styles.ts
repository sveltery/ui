// Copies shadcn's `apps/v4/registry/styles/style-<name>.css` at UPSTREAM_COMMIT into `styles/upstream/` and
// rewrites each `styles/scoped/<name>.css` with upstream's rules in the scoped sheet's own order. Run
// `node apps/docs/registry/sync-styles.ts` after changing UPSTREAM_COMMIT; styles.test.ts fails while a scoped
// sheet's rules differ from upstream's.
//
// The order is ours because the docs resolve `cn-*` tokens through the cascade, where the later rule wins.
// ui.shadcn.com and the CLI expand the tokens and merge them in class order instead, which no single rule
// order reproduces; upstream's order would flip FieldLabel's line height.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

export const UPSTREAM_COMMIT = 'd2fba50ee5b9113008b5bb908563527b7efd2f27';

const styles = new URL('./styles/', import.meta.url);

type Item = { key: string; text: string; gap: string; mark: boolean };

const ITEM = /(?:( {2}\/\* MARK: [^\n]*\*\/)|( {2}\/\* \.cn-[\s\S]*?\*\/)|( {2}(\.cn-[^\n]*?) \{\n(?: {4}[^\n]*\n)* {2}\}))(\n\n?)/y;

/** Splits a sheet into its MARK comments, rules and commented-out rules, keyed for matching across sheets. */
function items(css: string, file: string) {
  const open = /^(?:\/\*[^\n]*\*\/\n)?\.style-[a-z]+ \{\n/.exec(css);
  if (!open || !css.endsWith('}\n')) throw new Error(`${file}: expected one .style-<name> block`);
  const list: Item[] = [];
  ITEM.lastIndex = open[0].length;
  while (ITEM.lastIndex < css.length - 2) {
    const at = ITEM.lastIndex;
    const match = ITEM.exec(css);
    if (!match) throw new Error(`${file}: unexpected text at offset ${at}: ${css.slice(at, at + 60)}`);
    const [, mark, commented, rule, selector, gap = ''] = match;
    list.push({ key: selector ?? mark ?? commented!, text: mark ?? commented ?? rule!, gap: mark ? gap : '\n\n', mark: Boolean(mark) });
  }
  return list;
}

type Patch = { selectors: string[]; edit: (utility: string) => string };

const PATCHES: Patch[] = [
  {
    // Upstream's slot is a div that `input-otp` marks `data-active`. Ours is the focused input itself.
    selectors: ['.cn-input-otp-slot'],
    edit: (utility) => utility.replace('data-[active=true]:', 'focus:'),
  },
  {
    // Base UI 1.9.0 marks an open submenu or menu trigger `data-popup-open`, never `data-open`,
    // so upstream's `data-open:` classes on these triggers never match.
    selectors: ['.cn-context-menu-sub-trigger', '.cn-dropdown-menu-sub-trigger', '.cn-menubar-sub-trigger', '.cn-sidebar-menu-button'],
    edit: (utility) => utility.replace(/^data-open:/, 'data-popup-open:'),
  },
];

/** Applies PATCHES to each rule they name, dropping a utility the edit duplicates. Throws when one changes nothing. */
function patch(item: Item, style: string): Item {
  const found = PATCHES.find(({ selectors }) => selectors.includes(item.key));
  if (!found) return item;
  const [head = '', utilities = ''] = /^([\s\S]*@apply )([^;\n]+)/.exec(item.text)?.slice(1) ?? [];
  const edited = [...new Set(utilities.split(' ').map(found.edit))].join(' ');
  if (edited === utilities) throw new Error(`style-${style}.css: the patch for ${item.key} no longer applies`);
  return { ...item, text: item.text.replace(head + utilities, head + edited) };
}

/**
 * Every menu surface carries `cn-menu-translucent`, and the CLI swaps it for the translucent utilities only when
 * the preset's menu color is translucent. Through the cascade the rule would make every docs menu translucent.
 */
const CLI_ONLY = new Set(['  /* MARK: Menu Translucent */', '.cn-menu-translucent', '.cn-menu-translucent-aria']);

/**
 * Upstream's rules in `current`'s order. A rule `current` lacks goes after the item that precedes it upstream;
 * a rule upstream dropped is dropped, and so are the CLI_ONLY rules.
 */
export function scopedSheet(upstream: string, current: string, style: string) {
  const source = items(upstream, `style-${style}.css`).filter(({ key }) => !CLI_ONLY.has(key)).map((item) => patch(item, style));
  const byKey = new Map(source.map((item) => [item.key, item]));
  const result = items(current, `scoped/${style}.css`).flatMap((item) => (item.mark ? [item] : (byKey.get(item.key) ?? [])));
  source.forEach((item, index) => {
    if (result.some(({ key }) => key === item.key)) return;
    const before = source.slice(0, index).findLast(({ key }) => result.some((placed) => placed.key === key));
    result.splice(before ? result.findIndex(({ key }) => key === before.key) + 1 : 0, 0, item);
  });
  const body = result.map((item, index) => item.text + (index < result.length - 1 ? item.gap : '\n')).join('');
  return `/* Derived from shadcn-ui/ui ${UPSTREAM_COMMIT}; MIT: apps/docs/registry/THIRD_PARTY_NOTICES.md. */\n.style-${style} {\n${body}}\n`;
}

if (import.meta.main) {
  for (const file of readdirSync(new URL('scoped/', styles))) {
    const style = file.replace(/\.css$/, '');
    const url = `https://raw.githubusercontent.com/shadcn-ui/ui/${UPSTREAM_COMMIT}/apps/v4/registry/styles/style-${style}.css`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: ${response.status}`);
    const upstream = await response.text();
    writeFileSync(new URL(`upstream/style-${style}.css`, styles), upstream);
    const scoped = new URL(`scoped/${file}`, styles);
    writeFileSync(scoped, scopedSheet(upstream, readFileSync(scoped, 'utf8'), style));
  }
}
