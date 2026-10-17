import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { findColorFamily } from './colors.js';
import type { Config } from './config.js';
import {
  DEFAULT_PRESETS,
  encodePreset,
  PRESET_BASE_COLORS,
  PRESET_FONT_HEADINGS,
  PRESET_FONTS,
  PRESET_ICON_LIBRARIES,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  PRESET_THEMES,
  type PresetCode,
  type PresetConfig,
  type PresetFont,
} from './preset/index.js';

// Ported from shadcn's packages/shadcn/src/preset/resolve.ts, without the Next.js font readers.

export type ResolvedPreset = { code: PresetCode; values: Required<PresetConfig>; fallbacks: (keyof PresetConfig)[] };

type CssState = { rootVars: Record<string, string>; darkVars: Record<string, string>; themeVars: Record<string, string>; imports: string[] };

const SERIF_FONTS = new Set<PresetFont>(['eb-garamond', 'instrument-serif', 'lora', 'merriweather', 'playfair-display', 'noto-serif', 'roboto-slab']);
const MONO_FONTS = new Set<PresetFont>(['jetbrains-mono', 'geist-mono']);
const ROOT_FONT_VARIABLES = ['--font-sans', '--font-serif', '--font-mono'] as const;
type RootFontVariable = (typeof ROOT_FONT_VARIABLES)[number];
const FONT_VARIABLES: readonly string[] = [...ROOT_FONT_VARIABLES, '--font-heading'];

// What `--radius` in `:root` says about a preset. 0.625rem is the default radius, which `medium` repeats.
const RADIUS_OF: Record<string, PresetConfig['radius']> = { '0': 'none', '0rem': 'none', '0.45rem': 'small', '0.625rem': 'default', '0.875rem': 'large' };

/** The order `fallbacks` lists settings in, as upstream does. */
const FALLBACK_ORDER = ['baseColor', 'theme', 'chartColor', 'iconLibrary', 'font', 'fontHeading', 'radius', 'menuAccent', 'menuColor'] as const satisfies readonly (keyof PresetConfig)[];

const normalize = (value: string | undefined) => (value ?? '').trim().replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').replace(/"/g, "'").toLowerCase();
const oneOf = <T extends string>(options: readonly T[], value: string | undefined): T | null => (options as readonly string[]).includes(value ?? '') ? (value as T) : null;
const stripQuotes = (value: string) => value.replace(/^['"]|['"]$/g, '');
const varReference = (value: string) => /^var\((--[a-z0-9-]+)\)$/.exec(normalize(value))?.[1] ?? null;

function declarations(node: { nodes?: postcss.ChildNode[] }, into: Record<string, string>) {
  for (const child of node.nodes ?? []) if (child.type === 'decl' && child.prop.startsWith('--')) into[child.prop] = child.value.trim();
}

function readCssState(path: string): CssState {
  const state: CssState = { rootVars: {}, darkVars: {}, themeVars: {}, imports: [] };
  if (!existsSync(path)) return state;
  const root = postcss.parse(readFileSync(path, 'utf8'));
  root.walkAtRules('import', (atRule) => {
    const source = /^url\((['"]?)(.+?)\1\)$/.exec(atRule.params.trim())?.[2] ?? /^(['"])(.+?)\1$/.exec(atRule.params.trim())?.[2];
    if (source) state.imports.push(source);
  });
  root.walkRules((rule) => {
    const selectors = rule.selector.split(',').map((selector) => selector.trim());
    if (selectors.includes(':root')) declarations(rule, state.rootVars);
    if (selectors.includes('.dark')) declarations(rule, state.darkVars);
  });
  root.walkAtRules('theme', (atRule) => {
    if (atRule.params.trim() === 'inline') declarations(atRule, state.themeVars);
  });
  return state;
}

/** The family when the light and dark values agree on one, else null. */
function colorFamily(light: string | undefined, dark: string | undefined): PresetConfig['theme'] | null {
  const family = findColorFamily(light);
  if (!family || !(PRESET_THEMES as readonly string[]).includes(family)) return null;
  return dark === undefined || findColorFamily(dark) === family ? family : null;
}

function fontOfFamily(value: string | undefined): PresetFont | null {
  if (!value) return null;
  const primary = stripQuotes(value.split(',')[0]?.trim() ?? '').replace(/\s+variable$/i, '').trim();
  return primary ? oneOf(PRESET_FONTS, normalize(primary.replace(/\s+/g, '-'))) : null;
}

const fontOfDependency = (source: string) => (source.startsWith('@fontsource-variable/') ? oneOf(PRESET_FONTS, source.slice('@fontsource-variable/'.length)) : null);
const variableOf = (font: PresetFont): RootFontVariable => (MONO_FONTS.has(font) ? '--font-mono' : SERIF_FONTS.has(font) ? '--font-serif' : '--font-sans');

function variableValue(state: CssState, variable: string): string | null {
  const theme = state.themeVars[variable];
  if (theme && varReference(theme) !== variable) return theme;
  return state.rootVars[variable] ?? theme ?? null;
}

/** Follows `var(--font-x)` references between font variables to a font-family value. */
function fontValue(state: CssState, variable: string, seen = new Set<string>()): string | null {
  if (seen.has(variable)) return null;
  seen.add(variable);
  const value = variableValue(state, variable);
  if (!value) return null;
  const reference = varReference(value);
  if (!reference) return value;
  return FONT_VARIABLES.includes(reference) ? fontValue(state, reference, seen) : null;
}

function bodyFont(state: CssState): PresetFont | null {
  for (const variable of ROOT_FONT_VARIABLES) {
    const matched = fontOfFamily(fontValue(state, variable) ?? undefined);
    if (matched) return matched;
  }
  for (const variable of ROOT_FONT_VARIABLES) {
    const imported = state.imports.flatMap((source) => fontOfDependency(source) ?? []).filter((font) => variableOf(font) === variable);
    if (imported.length === 1) return imported[0]!;
  }
  return null;
}

function headingFont(state: CssState, body: PresetFont): PresetConfig['fontHeading'] | null {
  const matched = fontOfFamily(fontValue(state, '--font-heading') ?? undefined);
  if (matched) return matched === body ? 'inherit' : matched;
  const value = variableValue(state, '--font-heading');
  const reference = value ? varReference(value) : null;
  if (reference && (ROOT_FONT_VARIABLES as readonly string[]).includes(reference)) {
    const root = fontOfFamily(fontValue(state, reference) ?? undefined);
    return !root || root === body ? 'inherit' : root;
  }
  return null;
}

/**
 * The preset a project's `components.json` and CSS file add up to, with the settings the CSS did not reveal filled in from the
 * style's defaults. `fallbacks` names those settings, so the code is exact for every setting not listed there.
 */
export function resolveProjectPreset(config: Config, cwd: string): ResolvedPreset {
  const defaults = DEFAULT_PRESETS[config.style];
  const state = readCssState(join(cwd, config.tailwind.css));
  const detected = {
    baseColor: oneOf(PRESET_BASE_COLORS, config.tailwind.baseColor),
    theme: colorFamily(state.rootVars['--primary'], state.darkVars['--primary']),
    chartColor: colorFamily(state.rootVars['--chart-1'], state.darkVars['--chart-1']),
    iconLibrary: oneOf(PRESET_ICON_LIBRARIES, config.iconLibrary),
    font: bodyFont(state),
    radius: RADIUS_OF[normalize(state.rootVars['--radius'])] ?? null,
    menuAccent: oneOf(PRESET_MENU_ACCENTS, config.menuAccent),
    menuColor: oneOf(PRESET_MENU_COLORS, config.menuColor),
  };
  const font = detected.font ?? defaults.font;
  const detectedHeading = headingFont(state, font);
  const heading = detectedHeading ?? defaults.fontHeading;
  const fontHeading = oneOf(PRESET_FONT_HEADINGS, heading === font ? 'inherit' : heading) ?? defaults.fontHeading;

  const values: Required<PresetConfig> = {
    style: config.style,
    baseColor: detected.baseColor ?? defaults.baseColor,
    theme: detected.theme ?? defaults.theme,
    chartColor: detected.chartColor ?? defaults.chartColor,
    iconLibrary: detected.iconLibrary ?? defaults.iconLibrary,
    font,
    fontHeading,
    radius: detected.radius ?? defaults.radius,
    menuAccent: detected.menuAccent ?? defaults.menuAccent,
    menuColor: detected.menuColor ?? defaults.menuColor,
  };
  const detectedAll = { ...detected, fontHeading: detectedHeading };
  const fallbacks = FALLBACK_ORDER.filter((key) => detectedAll[key] === null);
  return { code: encodePreset(values), values, fallbacks };
}
