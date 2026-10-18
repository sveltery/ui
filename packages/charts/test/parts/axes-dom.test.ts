import { describe, expect, it } from 'vitest';
import AxesChart from './fixtures/AxesChart.svelte';
import { render } from '../shell/mount.js';

const data = [
  { name: 'a', uv: 400 },
  { name: 'b', uv: 300 },
  { name: 'c', uv: 200 },
];

const attributes = (element: Element | null) => (element ? element.getAttributeNames() : []);

describe('XAxis, YAxis and CartesianGrid', () => {
  it('portals the tick labels into the label layer and keeps tick lines with the axis', () => {
    const { target } = render(AxesChart, { data });
    const axis = target.querySelector('.recharts-zIndex-layer_500 > .recharts-xAxis');
    expect(axis?.getAttribute('class')).toBe('recharts-layer recharts-cartesian-axis recharts-xAxis xAxis');
    expect(axis?.querySelectorAll('.recharts-cartesian-axis-tick-line')).toHaveLength(3);
    const labels = target.querySelectorAll('.recharts-zIndex-layer_2000 > .recharts-xAxis-tick-labels text');
    expect([...labels].map((text) => text.textContent)).toEqual(['a', 'b', 'c']);
  });

  it('writes tick text attributes in the order recharts does', () => {
    const { target } = render(AxesChart, { data });
    const text = target.querySelector('.recharts-xAxis-tick-labels text');
    expect(attributes(text)).toEqual(['height', 'orientation', 'width', 'stroke', 'x', 'y', 'class', 'text-anchor', 'fill']);
    expect(text?.querySelector('tspan')?.getAttribute('dy')).toBe('0.71em');
  });

  it('draws grid lines with the offset box as attributes, like recharts', () => {
    const { target } = render(AxesChart, { data });
    const line = target.querySelector('.recharts-zIndex-layer_-100 .recharts-cartesian-grid-horizontal line');
    expect(attributes(line)).toEqual(['stroke', 'fill', 'x', 'y', 'width', 'height', 'x1', 'y1', 'x2', 'y2']);
    expect(target.querySelectorAll('.recharts-cartesian-grid-vertical line')).toHaveLength(5);
  });

  it('hides the grid directions that are turned off', () => {
    const { target } = render(AxesChart, { data, gridProps: { vertical: false } });
    expect(target.querySelector('.recharts-cartesian-grid-vertical')).toBeNull();
    expect(target.querySelector('.recharts-cartesian-grid-horizontal')).not.toBeNull();
  });

  it('removes the axis line and tick lines when asked', () => {
    const { target } = render(AxesChart, { data, xProps: { axisLine: false, tickLine: false } });
    expect(target.querySelector('.recharts-xAxis .recharts-cartesian-axis-line')).toBeNull();
    expect(target.querySelector('.recharts-xAxis .recharts-cartesian-axis-tick-line')).toBeNull();
    expect(target.querySelectorAll('.recharts-xAxis-tick-labels text')).toHaveLength(3);
  });

  it('formats ticks with tickFormatter', () => {
    const { target } = render(AxesChart, { data, xProps: { tickFormatter: (value: string) => value.toUpperCase() } });
    expect([...target.querySelectorAll('.recharts-xAxis-tick-labels text')].map((text) => text.textContent)).toEqual(['A', 'B', 'C']);
  });

  it('renders nothing for a hidden axis', () => {
    const { target } = render(AxesChart, { data, xProps: { hide: true } });
    expect(target.querySelector('.recharts-xAxis')).toBeNull();
  });
});
