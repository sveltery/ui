import { describe, expect, it } from 'vitest';
import BarFixture from './fixtures/BarFixture.svelte';
import { render } from '../shell/mount.js';

const data = [
  { name: 'a', uv: 400, color: 'blue' },
  { name: 'b', uv: 300, color: 'green' },
  { name: 'c', uv: 200, color: 'orange' },
];

describe('Bar', () => {
  it('renders one rectangle per data point, in recharts layers', () => {
    const { target } = render(BarFixture, { data: data.map(({ color: _color, ...entry }) => entry) });
    const bar = target.querySelector('.recharts-zIndex-layer_300 > .recharts-bar');
    expect(bar?.getAttribute('class')).toBe('recharts-layer recharts-bar');
    const rectangles = bar?.querySelectorAll(':scope > .recharts-bar-rectangles > .recharts-layer > .recharts-bar-rectangle > .recharts-inactive-bar > path.recharts-rectangle');
    expect(rectangles).toHaveLength(3);
    const path = rectangles?.[0];
    expect(path?.getAttributeNames()).toEqual(['fill', 'name', 'x', 'y', 'width', 'height', 'radius', 'class', 'd']);
    // The data point's own name wins over the Bar's, as upstream spreads the entry last.
    expect(path?.getAttribute('name')).toBe('a');
    expect(path?.getAttribute('fill')).toBe('red');
  });

  it('colors each rectangle from its Cell', () => {
    const { target } = render(BarFixture, { data, cells: true });
    expect([...target.querySelectorAll('path.recharts-rectangle')].map((path) => path.getAttribute('fill'))).toEqual(['blue', 'green', 'orange']);
  });

  it('renders a LabelList child with the values', () => {
    const { target } = render(BarFixture, { data, labelList: true });
    expect([...target.querySelectorAll('.recharts-label-list text')].map((text) => text.textContent)).toEqual(['400', '300', '200']);
  });

  it('renders a background rectangle per bar when asked', () => {
    const { target } = render(BarFixture, { data, barProps: { background: true } });
    expect(target.querySelectorAll('path.recharts-bar-background-rectangle')).toHaveLength(3);
  });

  it('renders the label prop as a LabelList', () => {
    const { target } = render(BarFixture, { data, barProps: { label: true } });
    expect([...target.querySelectorAll('.recharts-label-list text')].map((text) => text.textContent)).toEqual(['400', '300', '200']);
  });

  it('renders nothing when hidden', () => {
    const { target } = render(BarFixture, { data, barProps: { hide: true } });
    expect(target.querySelector('.recharts-bar')).toBeNull();
  });
});
