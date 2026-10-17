// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import type { Config } from '../src/config.js';
import { resolveProjectPreset } from '../src/resolve-preset.js';

const config = (overrides: Partial<Config> = {}): Config => ({
  style: 'nova',
  iconLibrary: 'lucide',
  menuColor: 'default',
  menuAccent: 'subtle',
  tailwind: { css: 'src/app.css', baseColor: 'neutral' },
  aliases: { components: '$lib/components', ui: '$lib/components/ui', utils: '$lib/utils', lib: '$lib', hooks: '$lib/hooks' },
  typescript: true,
  ...overrides,
});

// The CSS `init --preset b0` writes, trimmed to what a preset shows.
const b0 = `@import 'tailwindcss';
@import '@fontsource-variable/inter';
:root { --primary: oklch(0.205 0 0); --chart-1: oklch(0.87 0 0); --radius: 0.625rem; }
.dark { --primary: oklch(0.922 0 0); --chart-1: oklch(0.87 0 0); }
@theme inline { --font-sans: 'Inter Variable', sans-serif; --font-heading: var(--font-sans); }
`;

let cwd: string;
beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), 'sveltery-resolve-'));
  mkdirSync(join(cwd, 'src'));
});
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

const resolveWith = (css: string | null, overrides: Partial<Config> = {}) => {
  if (css !== null) writeFileSync(join(cwd, 'src/app.css'), css);
  return resolveProjectPreset(config(overrides), cwd);
};

describe('resolveProjectPreset', () => {
  test('reads the nova defaults back as b0, with nothing falling back', () => {
    expect(resolveWith(b0)).toEqual({
      code: 'b0',
      values: { style: 'nova', baseColor: 'neutral', theme: 'neutral', chartColor: 'neutral', iconLibrary: 'lucide', font: 'inter', fontHeading: 'inherit', radius: 'default', menuAccent: 'subtle', menuColor: 'default' },
      fallbacks: [],
    });
  });

  test('reads a distinct heading font, the radius and the accent from the CSS', () => {
    const css = `@import '@fontsource-variable/noto-sans';
:root { --primary: oklch(0.546 0.245 262.881); --chart-1: oklch(0.809 0.105 251.813); --radius: 0.875rem; }
.dark { --primary: oklch(0.488 0.243 264.376); --chart-1: oklch(0.809 0.105 251.813); }
@theme inline { --font-sans: 'Noto Sans Variable', sans-serif; --font-heading: 'Playfair Display Variable', serif; }
`;
    const { values, fallbacks } = resolveWith(css, { style: 'sera', iconLibrary: 'tabler', tailwind: { css: 'src/app.css', baseColor: 'taupe' }, menuAccent: 'bold', menuColor: 'inverted' });
    expect(values).toEqual({ style: 'sera', baseColor: 'taupe', theme: 'blue', chartColor: 'blue', iconLibrary: 'tabler', font: 'noto-sans', fontHeading: 'playfair-display', radius: 'large', menuAccent: 'bold', menuColor: 'inverted' });
    expect(fallbacks).toEqual([]);
  });

  test('takes the body font from the fontsource import when no variable names it', () => {
    expect(resolveWith(`@import '@fontsource-variable/jetbrains-mono';\n`).values.font).toBe('jetbrains-mono');
    expect(resolveWith(`@import '@fontsource-variable/jetbrains-mono';\n@import '@fontsource-variable/geist-mono';\n`).fallbacks).toContain('font');
  });

  test('lists what the CSS did not show, and takes the style default for each', () => {
    const { values, fallbacks, code } = resolveWith('@import "tailwindcss";\n', { style: 'sera' });
    expect(fallbacks).toEqual(['theme', 'chartColor', 'font', 'fontHeading', 'radius']);
    expect(values).toMatchObject({ style: 'sera', theme: 'taupe', chartColor: 'taupe', font: 'noto-sans', fontHeading: 'playfair-display', radius: 'default' });
    expect(code).toMatch(/^b/);
  });

  test('ignores a theme whose light and dark primary come from different families', () => {
    const css = ':root { --primary: oklch(0.546 0.245 262.881); }\n.dark { --primary: oklch(0.205 0 0); }\n';
    expect(resolveWith(css).fallbacks).toContain('theme');
  });

  test('treats a missing CSS file as showing nothing', () => {
    expect(resolveWith(null).fallbacks).toEqual(['theme', 'chartColor', 'font', 'fontHeading', 'radius']);
  });

  test('treats CSS that does not parse as showing nothing', () => {
    expect(resolveWith(':root { --primary: oklch(0.205 0 0);\n').fallbacks).toEqual(['theme', 'chartColor', 'font', 'fontHeading', 'radius']);
  });

  test('treats a CSS path that is a directory as showing nothing', () => {
    mkdirSync(join(cwd, 'src/app.css'));
    expect(resolveWith(null).fallbacks).toEqual(['theme', 'chartColor', 'font', 'fontHeading', 'radius']);
  });
});
