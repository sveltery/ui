// Ported from shadcn's apps/v4/app/(app)/(create)/lib (search-params.ts, parse-preset-input.ts, shuffle-presets.ts) and hooks
// (use-random.tsx, use-reset.tsx) at af983e8.
import { DEFAULT_PRESET_CONFIG, DEFAULT_PRESETS, decodePreset, encodePreset, isPresetCode, V1_CHART_COLOR_MAP, type PresetBaseColor, type PresetCode, type PresetConfig, type PresetTheme } from '@sveltery/ui/preset';
import type { PackageManager } from '$lib/package-manager.svelte';

/** Every field the Create page edits. A decoded v1 code has no `chartColor`, so `normalizeConfig` fills it. */
export type DesignConfig = Required<PresetConfig>;
export type DesignField = keyof DesignConfig;

/** The base colors the page offers. `gray` stays in the codec only. */
export const BASE_COLORS = ['neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe'] as const satisfies readonly PresetBaseColor[];

/** The accents, in upstream's picker order. Each base color adds itself to the front of this list. */
const ACCENTS = ['amber', 'blue', 'cyan', 'emerald', 'fuchsia', 'green', 'indigo', 'lime', 'orange', 'pink', 'purple', 'red', 'rose', 'sky', 'teal', 'violet', 'yellow'] as const satisfies readonly PresetTheme[];

/** The theme and chart colors a base color allows: itself, then every accent. */
export function themesForBaseColor(baseColor: PresetBaseColor): PresetTheme[] {
  return [baseColor, ...ACCENTS];
}

export function isTranslucent(menuColor: DesignConfig['menuColor']): boolean {
  return menuColor === 'default-translucent' || menuColor === 'inverted-translucent';
}

/**
 * Brings a config into the set the page can show: a theme or chart color the base color allows, a heading font that
 * equals the body font stored as `inherit`, and no bold accent on a translucent menu.
 */
export function normalizeConfig(config: PresetConfig): DesignConfig {
  const baseColor = config.baseColor === 'gray' ? 'neutral' : config.baseColor;
  const themes = themesForBaseColor(baseColor);
  const theme = themes.includes(config.theme) ? config.theme : baseColor;
  const chartColor = config.chartColor ?? (V1_CHART_COLOR_MAP[config.theme] as PresetTheme | undefined) ?? theme;
  return {
    ...config,
    baseColor,
    theme,
    chartColor: themes.includes(chartColor) ? chartColor : baseColor,
    fontHeading: config.fontHeading === config.font ? 'inherit' : config.fontHeading,
    menuAccent: config.menuAccent === 'bold' && isTranslucent(config.menuColor) ? 'subtle' : config.menuAccent,
  };
}

/** The config a preset code holds, or null when the code does not decode. */
export function configFromCode(code: string): DesignConfig | null {
  const config = decodePreset(code);
  return config && normalizeConfig(config);
}

/** Upstream's `b0`: every field at its first value. */
export const DEFAULT_CONFIG = normalizeConfig(DEFAULT_PRESET_CONFIG);

const PRESET_FLAG = /^--preset\b\s+(.+)$/i;

/** Reads what a user pastes into Open Preset: a code, `--preset <code>`, or a link with a `preset` query. */
export function parsePresetInput(value: string): PresetCode | null {
  const input = value.trim();
  if (!input) return null;
  let preset = input.match(PRESET_FLAG)?.[1]?.trim() ?? input;
  if (URL.canParse(preset)) preset = new URL(preset).searchParams.get('preset') ?? '';
  return isPresetCode(preset) ? preset : null;
}

// Curated codes that upstream's Shuffle picks from, from https://dialectcn.xyz.
const SHUFFLE_PRESETS = [
  'b6sUj34d9',
  'b2tqYzpa88',
  'b1W4tDrk',
  'b1aIuQ2XC',
  'b7jsW1RxJ5',
  'b870VEw0in',
  'b3Zheoix4U',
  'b1x9M2c4aI',
  'b1W7jDEW',
  'b51GFh7y6',
  'b2fms620zo',
  'b1Q5GC',
  'buKEvLs',
  'b5rR41Mtnc',
  'b6tOz2I0x',
  'b2hNTREGRN',
  'bdIJ7Sq',
  'b6TqMNb5Wb',
  'bJIirQ',
  'b4aRK5K0fb',
  'b5HCiD38LI',
  'bdHjvCi',
  'b7QDHijUjj',
  'b4ZVZIPi9h',
  'b1W4bcno',
] as const;

/** Picks a curated preset other than the current one. Locked fields keep their current value. */
export function shuffleConfig(current: DesignConfig, locks: ReadonlySet<DesignField>, random = Math.random): DesignConfig {
  const code = encodePreset(current);
  const codes = SHUFFLE_PRESETS.filter((candidate) => candidate !== code);
  const picked = configFromCode(codes[Math.floor(random() * codes.length)]!)!;
  const next = Object.fromEntries(Object.entries(picked).map(([field, value]) => [field, locks.has(field as DesignField) ? current[field as DesignField] : value]));
  return normalizeConfig(next as DesignConfig);
}

/** The named preset for the current style. Reset keeps the style, as upstream. */
export function resetConfig(current: DesignConfig): DesignConfig {
  const { style, baseColor, theme, chartColor, iconLibrary, font, fontHeading, radius, menuAccent, menuColor } = DEFAULT_PRESETS[current.style];
  return normalizeConfig({ style, baseColor, theme, chartColor, iconLibrary, font, fontHeading, radius, menuAccent, menuColor });
}

const RUNNERS: Record<PackageManager, string> = { pnpm: 'pnpm dlx', npm: 'npx', yarn: 'yarn dlx', bun: 'bunx --bun' };

/** The command that starts a project from a preset. `cli` is the CLI's package name. */
export function initCommand(packageManager: PackageManager, cli: string, code: PresetCode): string {
  return `${RUNNERS[packageManager]} ${cli} init --preset ${code}`;
}
