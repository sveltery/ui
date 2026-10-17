import postcss from 'postcss';
import type { CssVars } from '../registry.js';

/** A theme token a migration left as it was, and why. */
export type SkippedToken = { token: string; reason: string };

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ');

/**
 * The tokens to change from the `source` base color's values to the `target`'s: those whose value in `css` is still the
 * source's. Tokens that differ were customized, or set by a preset's theme color, and are kept and reported.
 */
export function baseColorMigration(css: string, source: CssVars, target: CssVars): { vars: { light: Record<string, string>; dark: Record<string, string> }; skipped: SkippedToken[] } {
  const current: Record<string, Record<string, string>> = { ':root': {}, '.dark': {} };
  postcss.parse(css).walkRules((rule) => {
    const values = current[rule.selector];
    if (values) rule.walkDecls((decl) => void (decl.prop.startsWith('--') && (values[decl.prop] = decl.value)));
  });

  const vars = { light: {} as Record<string, string>, dark: {} as Record<string, string> };
  const skipped: SkippedToken[] = [];
  for (const [mode, selector] of [
    ['light', ':root'],
    ['dark', '.dark'],
  ] as const) {
    for (const [name, sourceValue] of Object.entries(source[mode] ?? {})) {
      const targetValue = target[mode]?.[name];
      if (targetValue === undefined || normalize(sourceValue) === normalize(targetValue)) continue;
      const token = `--${name.replace(/^--/, '')}`;
      const value = current[selector]![token];
      if (value === undefined) skipped.push({ token, reason: 'not found in your CSS' });
      else if (normalize(value) === normalize(sourceValue)) vars[mode][name] = targetValue;
      else skipped.push({ token, reason: 'does not match the source base color' });
    }
  }
  return { vars, skipped };
}
