// Copies shadcn's `apps/v4/registry/styles/style-<name>.css` at UPSTREAM_COMMIT into `styles/upstream/` and
// writes each `styles/scoped/<name>.css` with upstream's rules, in upstream's order, plus the native rules
// derived from them. Run
// `node apps/docs/registry/sync-styles.ts` after changing UPSTREAM_COMMIT; styles.test.ts fails while a scoped
// sheet differs from upstream's.
import { readdirSync, writeFileSync } from 'node:fs';

export const UPSTREAM_COMMIT = 'd2fba50ee5b9113008b5bb908563527b7efd2f27';

const styles = new URL('./styles/', import.meta.url);

type Item = { key: string; text: string; gap: string };

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
    list.push({ key: selector ?? mark ?? commented!, text: mark ?? commented ?? rule!, gap: mark ? gap : '\n\n' });
  }
  return list;
}

type Patch = { selectors: string[]; styles?: string[]; edit: (utility: string) => string };

const PATCHES: Patch[] = [
  {
    // Base UI 1.9.0 marks an open submenu or menu trigger `data-popup-open`, never `data-open`,
    // so upstream's `data-open:` classes on these triggers never match.
    selectors: ['.cn-context-menu-sub-trigger', '.cn-dropdown-menu-sub-trigger', '.cn-menubar-sub-trigger', '.cn-sidebar-menu-button'],
    edit: (utility) => utility.replace(/^data-open:/, 'data-popup-open:'),
  },
  {
    // A fractional track height leaves the thumb a fractional inset, which the browser rounds to unequal
    // top and bottom margins. Whole pixels keep the thumb centered at every position.
    selectors: ['.cn-switch'],
    styles: ['lyra', 'maia', 'mira', 'nova', 'vega'],
    edit: (utility) => utility.replace('h-[18.4px]', 'h-[18px]').replace('h-[16.6px]', 'h-[16px]'),
  },
  {
    // A choice card highlights the checked Base UI radio or checkbox by `data-checked`. A NativeRadio
    // has no data attributes, so the card also matches a checked native input.
    selectors: ['.cn-field-label'],
    edit: (utility) => utility.replace(/(^|:)has-data-checked:/, '$1has-[[data-checked],input:checked]:'),
  },
];

/** Applies PATCHES to each rule they name, dropping a utility the edit duplicates. Throws when one changes nothing. */
function patch(item: Item, style: string): Item {
  const found = PATCHES.find(({ selectors, styles }) => selectors.includes(item.key) && (!styles || styles.includes(style)));
  if (!found) return item;
  const [head = '', utilities = ''] = /^([\s\S]*@apply )([^;\n]+)/.exec(item.text)?.slice(1) ?? [];
  const edited = [...new Set(utilities.split(' ').map(found.edit))].join(' ');
  if (edited === utilities) throw new Error(`style-${style}.css: the patch for ${item.key} no longer applies`);
  return { ...item, text: item.text.replace(head + utilities, head + edited) };
}

const utilitiesOf = (item: Item | undefined) => /@apply ([^;\n]+)/.exec(item?.text ?? '')?.[1]?.split(' ') ?? [];
const rule = (selector: string, utilities: string[]): Item => ({ key: selector, text: `  ${selector} {\n    @apply ${utilities.join(' ')};\n  }`, gap: '\n\n' });

/**
 * Sveltery-only native components have no upstream rules, so each style's rules are derived from the
 * Base UI component they look like. A styled `<input type="radio">` has `:checked` where Radio has
 * `data-checked`, and no child for the indicator, so the dot is a radial gradient of the icon's color and size.
 */
function nativeRadio(list: Item[], style: string): Item[] {
  const find = (key: string) => list.find((item) => item.key === key);
  const group = utilitiesOf(find('.cn-radio-group'));
  const icon = utilitiesOf(find('.cn-radio-group-indicator-icon'));
  const checked = { 'data-checked': 'checked', 'aria-checked': 'checked', 'not-data-checked': 'not-checked' } as Record<string, string>;
  const item = utilitiesOf(find('.cn-radio-group-item')).map((utility) => utility.split(':').map((part) => checked[part] ?? part).join(':'));
  const color = icon.find((utility) => /^bg-[a-z-]+$/.test(utility))?.slice(3);
  const size = (variant: string) => icon.find((utility) => utility.startsWith(`${variant}size-`))?.slice(variant.length + 5);
  if (!group.length || !item.length || !color || !size('')) throw new Error(`style-${style}.css: the native radio rules no longer derive from the radio group rules`);
  const dot = (value: string) => `bg-[radial-gradient(circle,var(--color-${color})_calc(var(--spacing)*${Number(value) / 2}),transparent_calc(var(--spacing)*${Number(value) / 2}_+_0.5px))]`;
  const dark = size('dark:');
  return [
    { key: '  /* MARK: Native Radio Group */', text: '  /* MARK: Native Radio Group */', gap: '\n' },
    rule('.cn-native-radio-group', group),
    rule('.cn-native-radio', [...item, `checked:${dot(size('')!)}`, ...(dark ? [`dark:checked:${dot(dark)}`] : [])]),
  ];
}

/** Upstream's sheet with PATCHES applied, in its own order, then the derived native rules after their source. */
export function scopedSheet(upstream: string, style: string) {
  const list = items(upstream, `style-${style}.css`);
  const after = list.findIndex((item) => item.key === '.cn-radio-group-indicator-icon');
  const body = [...list.slice(0, after + 1), ...nativeRadio(list, style), ...list.slice(after + 1)]
    .map((item) => patch(item, style))
    .map((item, index, all) => item.text + (index < all.length - 1 ? item.gap : '\n'))
    .join('');
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
    writeFileSync(scoped, scopedSheet(upstream, style));
  }
}
