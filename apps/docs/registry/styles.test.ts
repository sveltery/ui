// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseStyleSheet } from './styles';
import { styleNames } from './types';

const read = (style: string) => readFileSync(new URL(`../../../packages/ui/src/lib/styles/scoped/${style}.css`, import.meta.url), 'utf8');

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

  it('reads the radius scale', () => {
    const { radii } = parseStyleSheet(read('luma'), 'luma');
    expect([...radii]).toEqual([
      ['sm', 'calc(var(--radius) * 0.6)'],
      ['md', 'calc(var(--radius) * 0.8)'],
      ['lg', 'calc(var(--radius) * 1)'],
      ['xl', 'calc(var(--radius) * 1.4)'],
      ['2xl', 'calc(var(--radius) * 1.8)'],
      ['3xl', 'calc(var(--radius) * 2.2)'],
      ['4xl', 'calc(var(--radius) * 2.6)'],
    ]);
  });

  it('ignores a commented-out rule', () => {
    const css = read('sera');
    expect(css).toContain('/* .cn-input-group-addon-align-inline-start {');
    expect(parseStyleSheet(css, 'sera').utilities.has('cn-input-group-addon-align-inline-start')).toBe(false);
  });

  it('parses every style', () => {
    for (const style of styleNames) expect(parseStyleSheet(read(style), style).utilities.has('cn-button')).toBe(true);
  });

  it('throws on a selector shape it does not know, naming the file and selector', () => {
    const css = '@layer components {\n.style-nova.style-nova {\n  .cn-a .cn-b { @apply flex; }\n}\n}';
    expect(() => parseStyleSheet(css, 'nova')).toThrow('styles/scoped/nova.css: unsupported selector .cn-a .cn-b');
  });

  it('throws on a rule body that is more than one @apply', () => {
    const css = '@layer components {\n.style-nova.style-nova {\n  .cn-a { @apply flex; color: red; }\n}\n}';
    expect(() => parseStyleSheet(css, 'nova')).toThrow('unsupported rule body for .cn-a');
  });
});
