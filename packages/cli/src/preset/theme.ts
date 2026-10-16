import type { CssVars } from '../registry.js';
import { PRESET_FONT_DEFINITIONS } from './fonts.js';
import type { PresetConfig, PresetRadius, PresetTheme } from './preset.js';

/** `default` keeps the style's own radius. */
export const PRESET_RADIUS_VALUES: Record<PresetRadius, string | undefined> = {
  default: undefined,
  none: '0',
  small: '0.45rem',
  medium: '0.625rem',
  large: '0.875rem',
};

/** The registry's `cssVars` for each base color and accent theme a config can name. */
export type ThemeColors = Partial<Record<PresetTheme, CssVars>>;

export type PresetCssVars = { theme?: Record<string, string>; light: Record<string, string>; dark: Record<string, string> };

/**
 * Port of shadcn's `buildRegistryTheme`, plus the `--font-heading` var that its `buildRegistryBase` adds. Unlike
 * upstream's base colors, a sveltery base color carries a `theme` block (the `@theme inline` mappings and radius scale),
 * which passes through.
 */
export function buildTheme(config: PresetConfig, colors: ThemeColors): PresetCssVars {
  const base = colors[config.baseColor];
  const accent = colors[config.theme];
  if (!base || !accent) throw new Error(`Base color "${config.baseColor}" or theme "${config.theme}" not found`);

  const light = { ...base.light, ...accent.light };
  const dark = { ...base.dark, ...accent.dark };

  const chart = colors[config.chartColor ?? config.theme];
  for (let i = 1; i <= 5; i++) {
    const key = `chart-${i}`;
    if (chart?.light?.[key]) light[key] = chart.light[key];
    if (chart?.dark?.[key]) dark[key] = chart.dark[key];
  }

  if (config.menuAccent === 'bold') {
    for (const vars of [light, dark]) {
      vars.accent = vars.primary!;
      vars['accent-foreground'] = vars['primary-foreground']!;
    }
  }

  const radius = PRESET_RADIUS_VALUES[config.radius];
  if (radius) light.radius = radius;

  const theme = { ...base.theme };
  const fontHeading = config.fontHeading === config.font ? 'inherit' : config.fontHeading;
  if (fontHeading === 'inherit') theme['font-heading'] = `var(${PRESET_FONT_DEFINITIONS[config.font].variable})`;

  return { ...(Object.keys(theme).length > 0 && { theme }), light, dark };
}
