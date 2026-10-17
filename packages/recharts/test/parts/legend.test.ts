import { describe, expect, it } from 'vitest';
import LegendFixture from './fixtures/LegendFixture.svelte';
import { render } from '../shell/mount.js';

const data = [
  { name: 'a', uv: 400, pv: 100 },
  { name: 'b', uv: 300, pv: 200 },
];

describe('Legend', () => {
  it('portals after the tooltip and before the svg, like recharts', () => {
    const { target } = render(LegendFixture, { data });
    const wrapper = target.querySelector('.recharts-wrapper');
    expect([...(wrapper?.children ?? [])].map((child) => child.getAttribute('class'))).toEqual(['recharts-tooltip-wrapper', 'recharts-legend-wrapper', 'recharts-surface']);
  });

  it('lists every graphical item with its icon and name, sorted by value', () => {
    const { target } = render(LegendFixture, { data });
    const items = target.querySelectorAll('.recharts-legend-wrapper > ul.recharts-default-legend > li.recharts-legend-item');
    expect([...items].map((item) => item.getAttribute('class'))).toEqual(['recharts-legend-item legend-item-0', 'recharts-legend-item legend-item-1']);
    expect([...items].map((item) => item.querySelector('.recharts-legend-item-text')?.textContent)).toEqual(['Page views', 'uv']);
    const icon = items[0]?.querySelector('svg.recharts-surface > path.recharts-legend-icon');
    expect(icon?.getAttribute('fill')).toBe('blue');
    expect(items[0]?.querySelector('svg')?.getAttribute('aria-label')).toBe('Page views legend icon');
  });

  it('writes the default wrapper style', () => {
    const { target } = render(LegendFixture, { data });
    expect(target.querySelector('.recharts-legend-wrapper')?.getAttribute('style')).toBe('position: absolute; width: 490px; height: auto; left: 5px; bottom: 5px;');
  });

  it('formats item text with formatter', () => {
    const { target } = render(LegendFixture, { data, legendProps: { formatter: (value: string) => value.toUpperCase() } });
    expect([...target.querySelectorAll('.recharts-legend-item-text')].map((text) => text.textContent)).toEqual(['PAGE VIEWS', 'UV']);
  });
});
