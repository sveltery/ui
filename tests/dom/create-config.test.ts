import { describe, expect, it } from 'vitest';
import { DEFAULT_PRESET_CONFIG, DEFAULT_PRESETS, encodePreset, type PresetConfig } from '../../packages/cli/src/preset/index';
import { configFromCode, DEFAULT_CONFIG, initCommand, normalizeConfig, parsePresetInput, resetConfig, shuffleConfig } from '../../apps/docs/src/lib/create/config';

const config = (patch: Partial<PresetConfig>) => ({ ...DEFAULT_PRESET_CONFIG, ...patch });

describe('normalizeConfig', () => {
  it('maps gray to neutral, which the page offers instead', () => {
    expect(normalizeConfig(config({ baseColor: 'gray', theme: 'gray', chartColor: 'gray' }))).toMatchObject({ baseColor: 'neutral', theme: 'neutral', chartColor: 'neutral' });
  });

  it('keeps an accent theme and chart color when the base color changes', () => {
    expect(normalizeConfig(config({ baseColor: 'stone', theme: 'blue', chartColor: 'rose' }))).toMatchObject({ theme: 'blue', chartColor: 'rose' });
  });

  it('moves a theme or chart color the base color does not allow to the base color', () => {
    expect(normalizeConfig(config({ baseColor: 'stone', theme: 'zinc', chartColor: 'zinc' }))).toMatchObject({ theme: 'stone', chartColor: 'stone' });
  });

  it('gives a v1 code the chart color upstream gave it', () => {
    expect(normalizeConfig({ ...config({ theme: 'neutral' }), chartColor: undefined }).chartColor).toBe('blue');
  });

  it('stores a heading font that equals the body font as inherit', () => {
    expect(normalizeConfig(config({ font: 'figtree', fontHeading: 'figtree' })).fontHeading).toBe('inherit');
  });

  it('turns a bold accent subtle on a translucent menu', () => {
    expect(normalizeConfig(config({ menuAccent: 'bold', menuColor: 'inverted-translucent' })).menuAccent).toBe('subtle');
    expect(normalizeConfig(config({ menuAccent: 'bold', menuColor: 'inverted' })).menuAccent).toBe('bold');
  });
});

describe('parsePresetInput', () => {
  const code = encodePreset(DEFAULT_PRESETS.sera);

  it('reads a code, a --preset flag, or a link with a preset query', () => {
    expect(parsePresetInput(` ${code} `)).toBe(code);
    expect(parsePresetInput(`--preset ${code}`)).toBe(code);
    expect(parsePresetInput(`https://ui.sveltery.dev/create?preset=${code}&item=preview`)).toBe(code);
  });

  it('rejects anything else', () => {
    expect(parsePresetInput('')).toBeNull();
    expect(parsePresetInput('hello')).toBeNull();
    expect(parsePresetInput('https://ui.sveltery.dev/create')).toBeNull();
  });
});

describe('shuffleConfig', () => {
  it('picks a different curated preset and keeps the locked fields', () => {
    const current = configFromCode(encodePreset(DEFAULT_PRESETS.lyra))!;
    for (const roll of [0, 0.3, 0.6, 0.99]) {
      const next = shuffleConfig(current, new Set(['style', 'font']), () => roll);
      expect(next).toMatchObject({ style: 'lyra', font: current.font });
      expect(normalizeConfig(next)).toEqual(next);
    }
  });
});

describe('resetConfig', () => {
  it('returns the named preset for the current style', () => {
    expect(encodePreset(resetConfig({ ...DEFAULT_CONFIG, style: 'maia', radius: 'none' }))).toBe(encodePreset(normalizeConfig(DEFAULT_PRESETS.maia)));
  });
});

describe('initCommand', () => {
  it('uses each package manager runner', () => {
    expect(initCommand('pnpm', '@sveltery/ui', 'b0')).toBe('pnpm dlx @sveltery/ui init --preset b0');
    expect(initCommand('bun', '@sveltery/ui', 'b0')).toBe('bunx --bun @sveltery/ui init --preset b0');
  });
});
