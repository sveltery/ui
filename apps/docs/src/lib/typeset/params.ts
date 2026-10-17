// Port of shadcn's apps/v4/app/(app)/(typeset)/lib/search-params.ts and lib/fonts.ts at d2fba50.
import { PRESET_FONT_DEFINITIONS, type PresetFont } from '../../../../../packages/cli/src/preset/index.js';
import { CONTENT_OPTIONS } from './fixtures';

export const TYPESET_SIZES = [
  { value: '14', label: '14px' },
  { value: '15', label: '15px' },
  { value: '16', label: '16px' },
  { value: '18', label: '18px' },
] as const;

export const TYPESET_LEADINGS = [
  { value: '1.6', label: 'Tight (1.6)' },
  { value: '1.75', label: 'Regular (1.75)' },
  { value: '1.9', label: 'Loose (1.9)' },
] as const;

export const TYPESET_FLOWS = [
  { value: '1em', label: 'Compact (1em)' },
  { value: '1.25em', label: 'Regular (1.25em)' },
  { value: '2em', label: 'Airy (2em)' },
] as const;

export const TYPESET_MEASURES = [
  { value: '60', label: '60ch', width: '28em' },
  { value: '70', label: '70ch', width: '33em' },
  { value: '80', label: '80ch', width: '37em' },
  { value: '90', label: '90ch', width: '42em' },
] as const;

// Display faces that read poorly as body text stay out, as upstream.
const EXCLUDED_FONTS: PresetFont[] = ['instrument-serif', 'eb-garamond', 'playfair-display'];

export const FONTS = (Object.keys(PRESET_FONT_DEFINITIONS) as PresetFont[])
  .filter((id) => !EXCLUDED_FONTS.includes(id))
  .map((id) => ({ id, label: PRESET_FONT_DEFINITIONS[id].title, type: PRESET_FONT_DEFINITIONS[id].type, family: PRESET_FONT_DEFINITIONS[id].family }));

export type TypesetFont = (typeof FONTS)[number];

export const findFont = (id: string) => FONTS.find((font) => font.id === id);

const values = <T extends { value: string }>(options: readonly T[]) => options.map((option) => option.value);
const fontIds = FONTS.map((font) => font.id);

/** What each parameter accepts. Parsing, history and the pickers all read from here. */
const PARAM_VALUES = {
  body: fontIds,
  heading: ['inherit', ...fontIds],
  mono: fontIds,
  scale: values(TYPESET_SIZES),
  measure: values(TYPESET_MEASURES),
  flow: values(TYPESET_FLOWS),
  leading: values(TYPESET_LEADINGS),
  item: values(CONTENT_OPTIONS),
} as const;

export type TypesetParams = {
  body: PresetFont;
  heading: PresetFont | 'inherit';
  mono: PresetFont;
  scale: (typeof TYPESET_SIZES)[number]['value'];
  measure: (typeof TYPESET_MEASURES)[number]['value'];
  flow: (typeof TYPESET_FLOWS)[number]['value'];
  leading: (typeof TYPESET_LEADINGS)[number]['value'];
  item: (typeof CONTENT_OPTIONS)[number]['value'];
};

/** Every parameter but the specimen, which Shuffle and the locks leave alone. */
export type LockableParam = Exclude<keyof TypesetParams, 'item'>;

export const DEFAULT_PARAMS: TypesetParams = { body: 'geist', heading: 'inherit', mono: 'geist-mono', scale: '15', measure: '80', flow: '1.25em', leading: '1.75', item: 'docs' };

const PARAM_KEYS = Object.keys(DEFAULT_PARAMS) as (keyof TypesetParams)[];

/** The value if the parameter accepts it, otherwise null. */
export function coerceParam<K extends keyof TypesetParams>(key: K, value: unknown): TypesetParams[K] | null {
  return typeof value === 'string' && (PARAM_VALUES[key] as readonly string[]).includes(value) ? (value as TypesetParams[K]) : null;
}

/** Reads the parameters from a query. A missing or unknown value keeps its default, as nuqs's `withDefault`. */
export function parseParams(search: URLSearchParams): TypesetParams {
  return Object.fromEntries(PARAM_KEYS.map((key) => [key, coerceParam(key, search.get(key)) ?? DEFAULT_PARAMS[key]])) as TypesetParams;
}

/** A query with the parameters that differ from their default, as nuqs's serializer with `clearOnDefault`. */
export function serializeParams(params: TypesetParams): string {
  const search = new URLSearchParams();
  for (const key of PARAM_KEYS) if (params[key] !== DEFAULT_PARAMS[key]) search.set(key, params[key]);
  const query = search.toString();
  return query ? `?${query}` : '';
}

export const previewHref = (params: TypesetParams) => `/preview/typeset/${params.item}${serializeParams(params)}`;

export const sameParams = (a: TypesetParams, b: TypesetParams) => PARAM_KEYS.every((key) => a[key] === b[key]);

export const measureWidth = (measure: TypesetParams['measure']) => TYPESET_MEASURES.find((option) => option.value === measure)!.width;

export const headingFont = (params: TypesetParams) => (params.heading === 'inherit' ? params.body : params.heading);

/** The CSS variables the preview frame reads, as upstream's `previewValues`. */
export function previewValues(params: TypesetParams): Record<string, string> {
  return {
    '--preview-size': `${params.scale}px`,
    '--preview-leading': params.leading,
    '--preview-flow': params.flow,
    '--preview-measure': measureWidth(params.measure),
    '--preview-font': PRESET_FONT_DEFINITIONS[params.body].family,
    '--preview-font-heading': PRESET_FONT_DEFINITIONS[headingFont(params)].family,
    '--preview-font-mono': PRESET_FONT_DEFINITIONS[params.mono].family,
  };
}
