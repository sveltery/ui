import { describe, expect, it } from 'vitest';
import LineFixture from './fixtures/LineFixture.svelte';
import { render } from '../shell/mount.js';

const data = [
  { name: 'a', uv: 400 },
  { name: 'b', uv: 300 },
  { name: 'c', uv: 200 },
];

describe('Line', () => {
  it('renders the curve and a dot per point in the line layer', () => {
    const { target } = render(LineFixture, { data });
    const line = target.querySelector('.recharts-zIndex-layer_400 > .recharts-line');
    expect(line?.getAttribute('class')).toBe('recharts-layer recharts-line');
    const curve = line?.querySelector(':scope > .recharts-shape > path.recharts-curve.recharts-line-curve');
    expect(curve?.getAttribute('d')).toMatch(/^M/);
    expect(curve?.getAttribute('fill')).toBe('none');
    expect(curve?.getAttribute('stroke')).toBe('#3182bd');
    expect(target.querySelectorAll('.recharts-line-dots circle.recharts-dot.recharts-line-dot')).toHaveLength(3);
  });

  it('drops the dots with dot={false}', () => {
    const { target } = render(LineFixture, { data, lineProps: { dot: false } });
    expect(target.querySelector('.recharts-line-dots')).toBeNull();
  });

  it('renders the label prop as a LabelList', () => {
    const { target } = render(LineFixture, { data, lineProps: { label: true } });
    expect([...target.querySelectorAll('.recharts-label-list text')].map((text) => text.textContent)).toEqual(['400', '300', '200']);
  });
});
