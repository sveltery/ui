// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseStyleSheet } from './styles';
import { scopedSheet } from './sync-styles';
import { styleNames } from './types';

const read = (style: string) => readFileSync(new URL(`./styles/scoped/${style}.css`, import.meta.url), 'utf8');
const upstream = (style: string) => readFileSync(new URL(`./styles/upstream/style-${style}.css`, import.meta.url), 'utf8');

describe('scoped sheets', () => {
  it.each(styleNames)('%s has the pinned upstream rules', (style) => {
    expect(read(style), 'run `node apps/docs/registry/sync-styles.ts`').toBe(scopedSheet(upstream(style), read(style), style));
  });
});

describe('parseStyleSheet', () => {
  it('maps a token to the utilities of its @apply rule', () => {
    const { utilities } = parseStyleSheet(read('nova'), 'nova');
    expect(utilities.get('cn-button-variant-default')).toBe('bg-primary text-primary-foreground hover:bg-primary/80');
    expect(utilities.get('cn-button-variant-link')).toBe('text-primary underline-offset-4 hover:underline');
  });

  it('turns a :has() qualifier into has-[] variants appended to the token', () => {
    const { utilities } = parseStyleSheet(read('vega'), 'vega');
    expect(utilities.get('cn-card-content')).toBe(
      'px-(--card-spacing) has-[>_[data-slot=questionnaire-choices]]:flex has-[>_[data-slot=questionnaire-choices]]:flex-col has-[>_[data-slot=questionnaire-choices]]:gap-3',
    );
  });

  it('ignores a commented-out rule', () => {
    const css = read('sera');
    expect(css).toContain('/* .cn-input-group-addon-align-inline-start {');
    expect(parseStyleSheet(css, 'sera').utilities.has('cn-input-group-addon-align-inline-start')).toBe(false);
  });

  it('parses every style', () => {
    for (const style of styleNames) expect(parseStyleSheet(read(style), style).utilities.has('cn-button')).toBe(true);
  });

  it('maps a rule with an empty body to no utilities', () => {
    expect(parseStyleSheet('.style-nova {\n  .cn-a {\n  }\n}', 'nova').utilities.get('cn-a')).toBe('');
  });

  it('throws on a selector shape it does not know, naming the file and selector', () => {
    const css = '.style-nova {\n  .cn-a .cn-b { @apply flex; }\n}';
    expect(() => parseStyleSheet(css, 'nova')).toThrow('styles/scoped/nova.css: unsupported selector .cn-a .cn-b');
  });

  it('throws on a rule body that is more than one @apply', () => {
    const css = '.style-nova {\n  .cn-a { @apply flex; color: red; }\n}';
    expect(() => parseStyleSheet(css, 'nova')).toThrow('unsupported rule body for .cn-a');
  });

  it('throws on anything outside the one .style-<name> scope', () => {
    expect(() => parseStyleSheet('.style-vega {\n  .cn-a { @apply flex; }\n}', 'nova')).toThrow('unsupported top-level rule .style-vega');
    expect(() => parseStyleSheet('.style-nova {\n  --x: 1;\n}', 'nova')).toThrow('unsupported declaration --x');
  });
});
