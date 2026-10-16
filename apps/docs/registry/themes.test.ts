// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseStyleSheet } from './styles';
import { parseThemes } from './themes';

const lib = new URL('./styles/', import.meta.url);
const radii = parseStyleSheet(readFileSync(new URL('scoped/nova.css', lib), 'utf8'), 'nova').radii;
const themes = parseThemes(readFileSync(new URL('themes.css', lib), 'utf8'), radii);

describe('parseThemes', () => {
  it('gives the neutral light and dark variables', () => {
    expect(themes.neutral.light).toMatchObject({ 'background': 'oklch(1 0 0)', 'foreground': 'oklch(0.145 0 0)', 'primary': 'oklch(0.205 0 0)', 'radius': '0.625rem' });
    expect(themes.neutral.dark).toMatchObject({ 'background': 'oklch(0.145 0 0)', 'foreground': 'oklch(0.985 0 0)' });
  });

  it('reads a different color from its own block', () => {
    expect(themes.stone.light).toMatchObject({ 'foreground': 'oklch(0.147 0.004 49.25)', 'primary': 'oklch(0.216 0.006 56.043)' });
  });

  it('keeps the color mappings of @theme and replaces the radius scale', () => {
    expect(themes.zinc.theme).toMatchObject({
      'color-background': 'var(--background)',
      'color-sidebar-ring': 'var(--sidebar-ring)',
      'radius-sm': 'calc(var(--radius) * 0.6)',
      'radius-md': 'calc(var(--radius) * 0.8)',
      'radius-lg': 'calc(var(--radius) * 1)',
      'radius-xl': 'calc(var(--radius) * 1.4)',
      'radius-2xl': 'calc(var(--radius) * 1.8)',
      'radius-3xl': 'calc(var(--radius) * 2.2)',
      'radius-4xl': 'calc(var(--radius) * 2.6)',
    });
    expect(Object.values(themes.zinc.theme!).join(' ')).not.toContain('--ui-radius');
  });

  it('throws when the style radius scale does not match @theme', () => {
    expect(() => parseThemes(readFileSync(new URL('themes.css', lib), 'utf8'), new Map([['sm', 'x']]))).toThrow('@theme sets --radius-sm, md, lg, xl, 2xl, 3xl, 4xl but the styles set --ui-radius-sm');
  });
});
