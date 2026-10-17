import type { ResolvedPreset } from './resolve-preset.js';

/** `key  value` lines, indented by two and with the values aligned. */
export function formatEntries(values: Record<string, string>): string[] {
  const width = Math.max(...Object.keys(values).map((key) => key.length));
  return Object.entries(values).map(([key, value]) => `  ${key.padEnd(width + 2)}${value}`);
}

/** The Preset group of `info`, `preset resolve` and `preset decode`. A `*` marks a value in `fallbacks`, explained by `note`. */
export function formatPreset(preset: ResolvedPreset, createPage: string, note = '  * Uses preset defaults for values the project does not show.'): string[] {
  const { values, fallbacks } = preset;
  const show = (key: keyof typeof values) => `${values[key]}${fallbacks.includes(key) ? '*' : ''}`;
  const lines = formatEntries({
    code: preset.code,
    version: preset.code[0]!,
    style: values.style,
    baseColor: show('baseColor'),
    theme: show('theme'),
    chartColor: show('chartColor'),
    iconLibrary: show('iconLibrary'),
    font: show('font'),
    fontHeading: show('fontHeading'),
    radius: show('radius'),
    menuAccent: show('menuAccent'),
    menuColor: show('menuColor'),
    url: `${createPage}?preset=${preset.code}`,
  });
  if (fallbacks.length > 0) lines.push('', note);
  return lines;
}
