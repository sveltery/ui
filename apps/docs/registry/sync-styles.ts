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
    edit: (utility) => utility.replace(/(^|:)has-data-checked:/, '$1has-[[data-checked],input:checked]:').replace(/(^|:)group-data-\[disabled=true\]\/field:/, '$1group-data-disabled/field:'),
  },
  {
    // Upstream's Field is a div that examples mark `data-invalid="true"` and `data-disabled="true"`. Field is
    // Base's Field.Root here, which marks itself with empty `data-invalid` and `data-disabled` attributes.
    selectors: ['.cn-field', '.cn-field-title'],
    edit: (utility) => utility.replace(/^data-\[invalid=true\]:/, 'data-invalid:').replace(/(^|:)group-data-\[disabled=true\]\/field:/, '$1group-data-disabled/field:'),
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
function nativeRadio(find: (key: string) => string[], style: string): Item[] {
  const group = find('.cn-radio-group');
  const icon = find('.cn-radio-group-indicator-icon');
  const checked = { 'data-checked': 'checked', 'aria-checked': 'checked', 'not-data-checked': 'not-checked' } as Record<string, string>;
  const item = find('.cn-radio-group-item').map((utility) => utility.split(':').map((part) => checked[part] ?? part).join(':'));
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

/** Splits a utility into its variants and its base, ignoring colons inside brackets. */
function parts(utility: string) {
  const variants: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < utility.length; index++) {
    const char = utility[index];
    if (char === '[') depth++;
    else if (char === ']') depth--;
    else if (char === ':' && depth === 0) {
      variants.push(utility.slice(start, index));
      start = index + 1;
    }
  }
  return { variants, base: utility.slice(start) };
}

/** Renames variants: Base marks state with `data-*` attributes, a native input with pseudo-classes. */
const renamed = (names: Record<string, string>) => (utility: string) => {
  const { variants, base } = parts(utility);
  return [...variants.map((variant) => names[variant] ?? variant), base].join(':');
};
const onInput = renamed({ 'data-checked': 'checked', 'data-unchecked': 'not-checked', 'not-data-checked': 'not-checked', 'aria-checked': 'checked' });
const onPeer = renamed({ 'data-checked': 'peer-checked', 'data-unchecked': 'peer-not-checked' });

/** Moves a utility onto a pseudo-element after its own variants, so `hover:ring-4` becomes `hover:[&::x]:ring-4`. */
const onPseudo = (pseudo: string) => (utility: string) => {
  const { variants, base } = parts(utility);
  return [...variants, `[&::${pseudo}]`, base].join(':');
};

/** A native range input is horizontal, so vertical utilities go and horizontal ones lose their variant. */
const horizontal = (utilities: string[]) =>
  utilities.flatMap((utility) => {
    const { variants, base } = parts(utility);
    if (variants.includes('data-vertical')) return [];
    return [[...variants.filter((variant) => variant !== 'data-horizontal'), base].join(':')];
  });

/** The height, in spacing units, that a track or thumb's `h-*` or `size-*` utility sets. */
const height = (utilities: string[]) => utilities.map((utility) => /^(?:h|size)-([\d.]+)$/.exec(utility)?.[1]).find(Boolean);

/**
 * NativeCheckbox and NativeSwitch are a styled `<input type="checkbox">`, so `data-checked` becomes `:checked`.
 * A switch's thumb is the input's sibling, so it reads `:checked` through `peer-checked`, and it starts past the
 * track's border, which a Base thumb sits inside.
 */
function nativeCheckbox(find: (key: string) => string[], style: string): Item[] {
  const checkbox = find('.cn-checkbox');
  if (!checkbox.length) throw new Error(`style-${style}.css: no .cn-checkbox rule to derive .cn-native-checkbox from`);
  return [{ key: '  /* MARK: Native Checkbox */', text: '  /* MARK: Native Checkbox */', gap: '\n' }, rule('.cn-native-checkbox', checkbox.map(onInput))];
}

function nativeSwitch(find: (key: string) => string[], style: string): Item[] {
  const track = find('.cn-switch');
  const thumb = find('.cn-switch-thumb');
  const border = track.find((utility) => /^border(-\d)?$/.test(utility));
  if (!track.length || !thumb.length || !border) throw new Error(`style-${style}.css: the native switch rules no longer derive from the switch rules`);
  const inset = border === 'border' ? 'ml-px' : `ml-${Number(border.slice(7)) / 4}`;
  return [
    { key: '  /* MARK: Native Switch */', text: '  /* MARK: Native Switch */', gap: '\n' },
    rule('.cn-native-switch', track.map(onInput)),
    rule('.cn-native-switch-thumb', [...thumb.map(onPeer), inset]),
  ];
}

/**
 * NativeSlider is a styled `<input type="range">`, whose track and thumb are pseudo-elements, so the slider's
 * rules move onto them. Only Firefox has a pseudo-element for the filled part of the track.
 */
function nativeSlider(find: (key: string) => string[], style: string): Item[] {
  const track = horizontal(find('.cn-slider-track'));
  const range = horizontal(find('.cn-slider-range'));
  // A thumb's `relative` and its `after:` hit area do nothing on a pseudo-element.
  const thumb = horizontal(find('.cn-slider-thumb')).filter((utility) => utility !== 'relative' && !utility.startsWith('after:'));
  const trackHeight = height(track);
  const thumbHeight = height(thumb);
  if (!trackHeight || !thumbHeight || !range.length) throw new Error(`style-${style}.css: the native slider rules no longer derive from the slider rules`);
  return [
    { key: '  /* MARK: Native Slider */', text: '  /* MARK: Native Slider */', gap: '\n' },
    rule('.cn-native-slider', [
      ...track.map(onPseudo('-webkit-slider-runnable-track')),
      ...track.map(onPseudo('-moz-range-track')),
      ...[`h-${trackHeight}`, ...range].map(onPseudo('-moz-range-progress')),
      ...['-webkit-slider-thumb', '-moz-range-thumb'].flatMap((pseudo) => ['box-border', 'appearance-none', ...thumb].map(onPseudo(pseudo))),
      // WebKit puts the thumb at the top of the track, where Firefox centers it.
      onPseudo('-webkit-slider-thumb')(`mt-[calc((${trackHeight}-${thumbHeight})*var(--spacing)/2)]`),
    ]),
  ];
}

const NATIVE: { after: string; derive: (find: (key: string) => string[], style: string) => Item[] }[] = [
  { after: '.cn-checkbox-indicator', derive: nativeCheckbox },
  { after: '.cn-radio-group-indicator-icon', derive: nativeRadio },
  { after: '.cn-slider-thumb', derive: nativeSlider },
  { after: '.cn-switch-thumb-aria', derive: nativeSwitch },
];

/** Upstream's sheet with PATCHES applied, in its own order, then the derived native rules after their source. */
export function scopedSheet(upstream: string, style: string) {
  // Native rules derive from the patched rules, so a patch to a Base rule reaches its native twin.
  const list = items(upstream, `style-${style}.css`).map((item) => patch(item, style));
  const find = (key: string) => utilitiesOf(list.find((item) => item.key === key));
  const body = list
    .flatMap((item) => [item, ...NATIVE.filter(({ after }) => after === item.key).flatMap(({ derive }) => derive(find, style))])
    .map((item, index, all) => item.text + (index < all.length - 1 ? item.gap : '\n'))
    .join('');
  for (const { after } of NATIVE) if (!list.some((item) => item.key === after)) throw new Error(`style-${style}.css: no ${after} rule to place native rules after`);
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
