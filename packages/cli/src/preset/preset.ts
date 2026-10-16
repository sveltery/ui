// Ported from shadcn's packages/registry/src/preset/preset.ts so a code made on either site decodes the same on both.
// A code bit-packs the field indexes into one integer under 2^53, writes it in base62, and prefixes a version character.
// To stay compatible: only append to a value array, keep each field's default at index 0, and only append new fields.

export const PRESET_STYLES = ['nova', 'vega', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'] as const;

// `gray` is not offered, but it keeps its index so later colors decode the same as upstream.
export const PRESET_BASE_COLORS = ['neutral', 'stone', 'zinc', 'gray', 'mauve', 'olive', 'mist', 'taupe'] as const;

export const PRESET_THEMES = [
  'neutral',
  'stone',
  'zinc',
  'gray',
  'amber',
  'blue',
  'cyan',
  'emerald',
  'fuchsia',
  'green',
  'indigo',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'rose',
  'sky',
  'teal',
  'violet',
  'yellow',
  'mauve',
  'olive',
  'mist',
  'taupe',
] as const;

export const PRESET_CHART_COLORS = PRESET_THEMES;

/** Before v2 codes, each base color drew its chart palette from this accent. Restores the old charts for a decoded v1 code. */
export const V1_CHART_COLOR_MAP: Record<string, string> = {
  neutral: 'blue',
  stone: 'lime',
  zinc: 'amber',
  mauve: 'emerald',
  olive: 'violet',
  mist: 'rose',
  taupe: 'cyan',
};

export const PRESET_ICON_LIBRARIES = ['lucide', 'hugeicons', 'tabler', 'phosphor', 'remixicon'] as const;

export const PRESET_FONTS = [
  'inter',
  'noto-sans',
  'nunito-sans',
  'figtree',
  'roboto',
  'raleway',
  'dm-sans',
  'public-sans',
  'outfit',
  'jetbrains-mono',
  'geist',
  'geist-mono',
  'lora',
  'merriweather',
  'playfair-display',
  'noto-serif',
  'roboto-slab',
  'oxanium',
  'manrope',
  'space-grotesk',
  'montserrat',
  'ibm-plex-sans',
  'source-sans-3',
  'instrument-sans',
  'eb-garamond',
  'instrument-serif',
] as const;
export const PRESET_FONT_HEADINGS = ['inherit', ...PRESET_FONTS] as const;

export const PRESET_RADII = ['default', 'none', 'small', 'medium', 'large'] as const;

export const PRESET_MENU_ACCENTS = ['subtle', 'bold'] as const;
export const PRESET_MENU_COLORS = ['default', 'inverted', 'default-translucent', 'inverted-translucent'] as const;

export type PresetStyle = (typeof PRESET_STYLES)[number];
export type PresetBaseColor = (typeof PRESET_BASE_COLORS)[number];
export type PresetTheme = (typeof PRESET_THEMES)[number];
export type PresetIconLibrary = (typeof PRESET_ICON_LIBRARIES)[number];
export type PresetFont = (typeof PRESET_FONTS)[number];
export type PresetFontHeading = (typeof PRESET_FONT_HEADINGS)[number];
export type PresetRadius = (typeof PRESET_RADII)[number];
export type PresetMenuAccent = (typeof PRESET_MENU_ACCENTS)[number];
export type PresetMenuColor = (typeof PRESET_MENU_COLORS)[number];

export type PresetConfig = {
  style: PresetStyle;
  baseColor: PresetBaseColor;
  theme: PresetTheme;
  /** Absent only on a decoded v1 code. Consumers fall back to `theme`, or to `V1_CHART_COLOR_MAP` for the old palette. */
  chartColor?: PresetTheme;
  iconLibrary: PresetIconLibrary;
  font: PresetFont;
  fontHeading: PresetFontHeading;
  radius: PresetRadius;
  menuAccent: PresetMenuAccent;
  menuColor: PresetMenuColor;
};

/** A string known to have a preset code's shape. Only `encodePreset` and `isPresetCode` produce one. */
export type PresetCode = string & { readonly __brand: 'PresetCode' };

type PresetField = { key: keyof PresetConfig; values: readonly string[]; bits: number };

// Version "a": 40 bits, no chartColor or fontHeading.
const PRESET_FIELDS_V1: readonly PresetField[] = [
  { key: 'menuColor', values: PRESET_MENU_COLORS, bits: 3 },
  { key: 'menuAccent', values: PRESET_MENU_ACCENTS, bits: 3 },
  { key: 'radius', values: PRESET_RADII, bits: 4 },
  { key: 'font', values: PRESET_FONTS, bits: 6 },
  { key: 'iconLibrary', values: PRESET_ICON_LIBRARIES, bits: 6 },
  { key: 'theme', values: PRESET_THEMES, bits: 6 },
  { key: 'baseColor', values: PRESET_BASE_COLORS, bits: 6 },
  { key: 'style', values: PRESET_STYLES, bits: 6 },
];

// Version "b": 51 bits.
const PRESET_FIELDS_V2: readonly PresetField[] = [
  ...PRESET_FIELDS_V1,
  { key: 'chartColor', values: PRESET_CHART_COLORS, bits: 6 },
  { key: 'fontHeading', values: PRESET_FONT_HEADINGS, bits: 5 },
];

export const DEFAULT_PRESET_CONFIG = Object.fromEntries(PRESET_FIELDS_V2.map((field) => [field.key, field.values[0]])) as Required<PresetConfig>;

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const CURRENT_VERSION = 'b';
const FIELDS_BY_VERSION: Record<string, readonly PresetField[]> = { a: PRESET_FIELDS_V1, b: PRESET_FIELDS_V2 };

export function toBase62(num: number): string {
  if (num === 0) return '0';
  let result = '';
  for (let n = num; n > 0; n = Math.floor(n / 62)) result = BASE62[n % 62] + result;
  return result;
}

/** Returns -1 when `str` has a character outside base62. */
export function fromBase62(str: string): number {
  let result = 0;
  for (const char of str) {
    const index = BASE62.indexOf(char);
    if (index === -1) return -1;
    result = result * 62 + index;
  }
  return result;
}

/** Always writes a version "b" code. Missing fields take their default, and an unknown value encodes as the default. */
export function encodePreset(config: Partial<PresetConfig>): PresetCode {
  const merged: PresetConfig = { ...DEFAULT_PRESET_CONFIG, ...config };
  // Multiplication, not bitwise operators, which truncate to 32 bits.
  let bits = 0;
  let offset = 0;
  for (const field of PRESET_FIELDS_V2) {
    const index = field.values.indexOf(merged[field.key] as string);
    bits += Math.max(index, 0) * 2 ** offset;
    offset += field.bits;
  }
  return (CURRENT_VERSION + toBase62(bits)) as PresetCode;
}

/** Returns null for a code with an unknown version or a non-base62 body. An index past a field's values decodes as its default. */
export function decodePreset(code: string): PresetConfig | null {
  if (!code || code.length < 2) return null;
  const version = code[0]!;
  const fields = FIELDS_BY_VERSION[version];
  if (!fields) return null;
  const bits = fromBase62(code.slice(1));
  if (bits < 0) return null;

  const result: Record<string, string> = {};
  let offset = 0;
  for (const field of fields) {
    const index = Math.floor(bits / 2 ** offset) % 2 ** field.bits;
    result[field.key] = field.values[index] ?? field.values[0]!;
    offset += field.bits;
  }
  if (version === 'a') result.fontHeading = 'inherit';
  return result as PresetConfig;
}

/** Checks the shape only: a known version character, then base62, 2 to 10 characters in all. */
export function isPresetCode(value: string): value is PresetCode {
  return value.length >= 2 && value.length <= 10 && value[0]! in FIELDS_BY_VERSION && fromBase62(value.slice(1)) >= 0;
}

export function isValidPreset(code: string): boolean {
  return decodePreset(code) !== null;
}

export function generateRandomConfig(): Required<PresetConfig> {
  return Object.fromEntries(PRESET_FIELDS_V2.map((field) => [field.key, field.values[Math.floor(Math.random() * field.values.length)]])) as Required<PresetConfig>;
}

export function generateRandomPreset(): PresetCode {
  return encodePreset(generateRandomConfig());
}
