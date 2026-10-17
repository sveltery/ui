import { describe, expect, it } from 'vitest';
import { rechartsProps, svelteProps } from '../../src/util/svelteProps.js';

type Props = { className?: string; width?: number; height?: number; layout?: 'horizontal' | 'vertical' };

describe('rechartsProps', () => {
  it('reads class as className and an undefined prop as its default', () => {
    const props = rechartsProps<Props, { layout: 'horizontal'; width: number }>(() => ({ class: 'mine', width: undefined, height: 300 }), { layout: 'horizontal', width: 500 });
    expect([props.className, props.width, props.height, props.layout]).toEqual(['mine', 500, 300, 'horizontal']);
  });

  it('spreads like the resolved bag upstream builds', () => {
    const props = rechartsProps<Props, { layout: 'horizontal' }>(() => ({ class: 'mine', height: 300 }), { layout: 'horizontal' });
    expect({ ...props }).toEqual({ className: 'mine', height: 300, layout: 'horizontal' });
    expect('class' in props).toBe(false);
    expect('layout' in props).toBe(true);
  });

  it('reads the live source on every access', () => {
    let source: Props & { class?: string } = { height: 300 };
    const props = rechartsProps<Props, { width: number }>(() => source, { width: 500 });
    source = { height: 200, width: 100 };
    expect([props.height, props.width]).toEqual([200, 100]);
  });

  it('gives the same result when applied to its own result', () => {
    const inner = rechartsProps<Props, { layout: 'vertical' }>(() => ({ class: 'mine' }), { layout: 'vertical' });
    const outer = rechartsProps<Props, { layout: 'horizontal'; width: number }>(() => inner, { layout: 'horizontal', width: 500 });
    expect({ ...outer }).toEqual({ className: 'mine', layout: 'vertical', width: 500 });
  });
});

describe('svelteProps', () => {
  it('turns className into class for a snippet argument', () => {
    expect(svelteProps({ className: 'recharts-dot', r: 3 })).toEqual({ class: 'recharts-dot', r: 3 });
    expect(svelteProps({ r: 3 })).toEqual({ r: 3 });
  });
});
