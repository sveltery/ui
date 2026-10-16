// @vitest-environment node
import * as upstream from 'shadcn/preset';
import { describe, expect, test } from 'vitest';
import { buildTheme, decodePreset, DEFAULT_PRESETS, encodePreset, generateRandomConfig, isPresetCode, type PresetConfig, type ThemeColors } from '../src/preset/index.js';

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// A seeded generator, so a failing code is reproducible.
let seed = 1;
const random = () => ((seed = (seed * 48271) % 0x7fffffff) - 1) / 0x7ffffffe;
const randomCode = (version: string) => version + Array.from({ length: 1 + Math.floor(random() * 9) }, () => BASE62[Math.floor(random() * 62)]).join('');

const configOf = ({ style, baseColor, theme, chartColor, iconLibrary, font, fontHeading, radius, menuAccent, menuColor }: PresetConfig) =>
  ({ style, baseColor, theme, chartColor, iconLibrary, font, fontHeading, radius, menuAccent, menuColor }) satisfies PresetConfig;

describe('codes match shadcn', () => {
  test('b0 decodes to the defaults', () => {
    expect(decodePreset('b0')).toEqual({
      style: 'nova',
      baseColor: 'neutral',
      theme: 'neutral',
      chartColor: 'neutral',
      iconLibrary: 'lucide',
      font: 'inter',
      fontHeading: 'inherit',
      radius: 'default',
      menuAccent: 'subtle',
      menuColor: 'default',
    });
  });

  test('every default preset encodes to the code shadcn writes and decodes back', () => {
    for (const preset of Object.values(DEFAULT_PRESETS)) {
      const config = configOf(preset);
      const code = encodePreset(config);
      expect(code).toBe(upstream.encodePreset(config));
      expect(decodePreset(code)).toEqual(config);
    }
  });

  test('a sera code carries its heading font and taupe colors', () => {
    const code = upstream.encodePreset(configOf(DEFAULT_PRESETS.sera));
    expect(decodePreset(code)).toMatchObject({ style: 'sera', baseColor: 'taupe', theme: 'taupe', font: 'noto-sans', fontHeading: 'playfair-display' });
  });

  test('a v1 code decodes without a chart color and with an inherited heading font', () => {
    const decoded = decodePreset('a2Lk9Qz');
    expect(decoded).toEqual(upstream.decodePreset('a2Lk9Qz'));
    expect(decoded).not.toHaveProperty('chartColor');
    expect(decoded?.fontHeading).toBe('inherit');
  });

  test('any code, including out-of-range indexes, decodes as shadcn decodes it', () => {
    for (let i = 0; i < 2000; i++) {
      const code = randomCode(i % 2 ? 'a' : 'b');
      expect(decodePreset(code), code).toEqual(upstream.decodePreset(code));
    }
  });

  test('any config encodes as shadcn encodes it', () => {
    for (let i = 0; i < 500; i++) {
      const config = generateRandomConfig();
      const code = encodePreset(config);
      expect(code).toBe(upstream.encodePreset(config));
      expect(decodePreset(code)).toEqual(config);
    }
  });
});

describe('malformed codes', () => {
  test.each(['', 'b', 'c0', 'B0', 'b-1', 'b 0', 'b0!'])('rejects %j', (code) => {
    expect(isPresetCode(code)).toBe(false);
    expect(decodePreset(code)).toBeNull();
    expect(upstream.decodePreset(code)).toBeNull();
  });

  test('isPresetCode agrees with shadcn on length bounds', () => {
    for (const code of ['b0', 'a0', 'bzzzzzzzzz', 'bzzzzzzzzzz', randomCode('b'), randomCode('a')]) {
      expect(isPresetCode(code), code).toBe(upstream.isPresetCode(code));
    }
  });
});

describe('buildTheme', () => {
  const colors: ThemeColors = {
    neutral: {
      theme: { 'radius-lg': 'var(--radius)' },
      light: { background: 'white', primary: 'black', 'primary-foreground': 'white', accent: 'gray', 'accent-foreground': 'black', 'chart-1': 'n1', radius: '0.625rem' },
      dark: { background: 'black', primary: 'white', 'primary-foreground': 'black', accent: 'gray', 'accent-foreground': 'white', 'chart-1': 'n1d' },
    },
    blue: { light: { primary: 'blue', 'chart-1': 'b1' }, dark: { primary: 'lightblue', 'chart-1': 'b1d' } },
    rose: { light: { primary: 'rose', 'chart-1': 'r1' }, dark: { primary: 'pink', 'chart-1': 'r1d' } },
  };
  const config = (overrides: Partial<PresetConfig>): PresetConfig => ({ ...decodePreset('b0')!, ...overrides });

  test('layers the accent over the base color, with charts from the chart color', () => {
    const vars = buildTheme(config({ theme: 'blue', chartColor: 'rose' }), colors);
    expect(vars.light).toMatchObject({ background: 'white', primary: 'blue', 'chart-1': 'r1', accent: 'gray' });
    expect(vars.dark).toMatchObject({ background: 'black', primary: 'lightblue', 'chart-1': 'r1d' });
  });

  test('takes charts from the accent when the code has no chart color', () => {
    const v1 = config({ theme: 'blue' });
    delete v1.chartColor;
    expect(buildTheme(v1, colors).light['chart-1']).toBe('b1');
  });

  test('a bold menu accent copies primary into accent', () => {
    const vars = buildTheme(config({ theme: 'blue', menuAccent: 'bold' }), colors);
    expect(vars.light).toMatchObject({ accent: 'blue', 'accent-foreground': 'white' });
    expect(vars.dark).toMatchObject({ accent: 'lightblue', 'accent-foreground': 'black' });
  });

  test('a radius other than default overrides the light radius', () => {
    expect(buildTheme(config({}), colors).light.radius).toBe('0.625rem');
    expect(buildTheme(config({ radius: 'none' }), colors).light.radius).toBe('0');
    expect(buildTheme(config({ radius: 'large' }), colors).light.radius).toBe('0.875rem');
  });

  test('an inherited heading font points --font-heading at the body font', () => {
    expect(buildTheme(config({ font: 'jetbrains-mono' }), colors).theme).toEqual({ 'radius-lg': 'var(--radius)', 'font-heading': 'var(--font-mono)' });
    expect(buildTheme(config({ font: 'lora', fontHeading: 'lora' }), colors).theme?.['font-heading']).toBe('var(--font-serif)');
    expect(buildTheme(config({ font: 'inter', fontHeading: 'playfair-display' }), colors).theme).not.toHaveProperty('font-heading');
  });

  test('throws for a color the registry does not have', () => {
    expect(() => buildTheme(config({ baseColor: 'gray', theme: 'gray' }), colors)).toThrow('not found');
  });
});
