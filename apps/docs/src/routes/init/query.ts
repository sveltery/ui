import { decodePreset, isPresetCode, PRESET_FONT_HEADINGS, PRESET_FONTS, PRESET_MENU_ACCENTS, PRESET_MENU_COLORS, PRESET_RADII, V1_CHART_COLOR_MAP, type PresetConfig } from '../../../../../packages/cli/src/preset/index.js';
import { accentColors, baseColors, iconLibraries, styleNames, type AccentColor, type BaseColor } from '../../../registry/types';

/** A theme the registry serves at `/r/themes/<name>.json`. */
export type ServedTheme = BaseColor | AccentColor;

export type InitConfig = Required<PresetConfig> & { baseColor: BaseColor; theme: ServedTheme; chartColor: ServedTheme };

export const INIT_PARTS = ['theme', 'font'] as const;
export type InitPart = (typeof INIT_PARTS)[number];

/** `parts` is set when `only` asks for a partial item. */
export type InitRequest = { config: InitConfig; pointer: boolean; parts?: InitPart[] };

export type ParseResult = { ok: true; request: InitRequest } | { ok: false; error: string };

class QueryError extends Error {}

const themesFor = (baseColor: BaseColor): readonly ServedTheme[] => [baseColor, ...accentColors];

function oneOf<T extends string>(name: string, value: string | null | undefined, options: readonly T[]): T {
  if (value === null || value === undefined) throw new QueryError(`Missing ${name}. Use one of: ${options.join(', ')}`);
  if (!(options as readonly string[]).includes(value)) throw new QueryError(`Invalid ${name} "${value}". Use one of: ${options.join(', ')}`);
  return value as T;
}

function parseParts(value: string | null): InitPart[] | undefined {
  if (value === null) return undefined;
  const aliases: Record<string, InitPart> = { theme: 'theme', font: 'font', fonts: 'font' };
  const raw = value
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  if (!raw.length || raw.some((part) => !aliases[part])) throw new QueryError(`Invalid only "${value}". Use one or more of: ${INIT_PARTS.join(', ')}`);
  return [...new Set(raw.map((part) => aliases[part]!))];
}

/** The fields a request names, from a preset code with optional `fontHeading` and `chartColor` overrides, or else from one param per field. */
function rawFields(params: URLSearchParams): Record<keyof PresetConfig, string | null | undefined> {
  const preset = params.get('preset');
  if (preset !== null) {
    const decoded = isPresetCode(preset) ? decodePreset(preset) : null;
    if (!decoded) throw new QueryError(`Invalid preset code "${preset}"`);
    return {
      ...decoded,
      fontHeading: params.get('fontHeading') ?? decoded.fontHeading,
      chartColor: params.get('chartColor') ?? decoded.chartColor ?? V1_CHART_COLOR_MAP[decoded.theme] ?? decoded.theme,
    };
  }
  const field = (name: keyof PresetConfig) => params.get(name);
  return {
    style: field('style'),
    baseColor: field('baseColor'),
    theme: field('theme'),
    chartColor: field('chartColor') ?? field('theme'),
    iconLibrary: field('iconLibrary'),
    font: field('font'),
    fontHeading: field('fontHeading') ?? 'inherit',
    radius: field('radius'),
    menuAccent: field('menuAccent'),
    menuColor: field('menuColor'),
  };
}

/** Parses the `/init` query, which takes the same params as shadcn's `/init`. */
export function parseInitQuery(params: URLSearchParams): ParseResult {
  try {
    const base = params.get('base');
    if (base !== null && base !== 'base') throw new QueryError(`Invalid base "${base}". Sveltery has only the base base.`);
    if (params.get('rtl') === 'true') throw new QueryError('rtl is not supported yet.');

    const fields = rawFields(params);
    // The registry serves no gray theme, so gray reads as neutral, as on the Create page.
    const served = (color: string | null | undefined) => (color === 'gray' ? 'neutral' : color);
    const baseColor = oneOf('baseColor', served(fields.baseColor), baseColors);
    const config: InitConfig = {
      style: oneOf('style', fields.style, styleNames),
      baseColor,
      theme: oneOf('theme', served(fields.theme), themesFor(baseColor)),
      chartColor: oneOf('chartColor', served(fields.chartColor), themesFor(baseColor)),
      iconLibrary: oneOf('iconLibrary', fields.iconLibrary, iconLibraries),
      font: oneOf('font', fields.font, PRESET_FONTS),
      fontHeading: oneOf('fontHeading', fields.fontHeading, PRESET_FONT_HEADINGS),
      radius: oneOf('radius', fields.radius, PRESET_RADII),
      menuAccent: oneOf('menuAccent', fields.menuAccent, PRESET_MENU_ACCENTS),
      menuColor: oneOf('menuColor', fields.menuColor, PRESET_MENU_COLORS),
    };
    return { ok: true, request: { config, pointer: params.get('pointer') === 'true', parts: parseParts(params.get('only')) } };
  } catch (error) {
    if (error instanceof QueryError) return { ok: false, error: error.message };
    throw error;
  }
}
