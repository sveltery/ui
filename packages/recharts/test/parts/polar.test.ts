import { flushSync } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import PieFixture from './fixtures/PieFixture.svelte';
import RadarFixture from './fixtures/RadarFixture.svelte';
import RadialBarFixture from './fixtures/RadialBarFixture.svelte';
import { render, settle } from '../shell/mount.js';

const data = [
  { name: 'a', value: 400, color: 'blue' },
  { name: 'b', value: 300, color: 'green' },
  { name: 'c', value: 200, color: 'orange' },
];

const all = (target: HTMLElement, selector: string, attribute: string) => [...target.querySelectorAll(selector)].map((element) => element.getAttribute(attribute));
const texts = (target: HTMLElement, selector: string) => [...target.querySelectorAll(selector)].map((element) => element.textContent);

function animate() {
  for (let i = 0; i < 60; i++) {
    vi.advanceTimersByTime(50);
    flushSync();
  }
  settle();
}

describe('Pie', () => {
  it('renders one sector per data point in recharts layers', () => {
    const { target } = render(PieFixture, { data });
    const pie = target.querySelector('.recharts-zIndex-layer_100 > g.recharts-layer.recharts-pie');
    expect(pie?.getAttribute('tabindex')).toBe('0');
    const paths = pie?.querySelectorAll(':scope > .recharts-layer > .recharts-pie-sector > .recharts-shape > path.recharts-sector');
    expect(paths).toHaveLength(3);
    expect(paths?.[0].getAttributeNames()).toEqual(['cx', 'cy', 'fill', 'stroke', 'name', 'color', 'tabindex', 'data-recharts-item-index', 'data-recharts-item-id', 'class', 'd']);
    expect(paths?.[0].getAttribute('d')).toBe('M 356,200\n    A 156,156,0,\n    0,0,\n    53.408,146.6449\n  L 200,200 Z');
  });

  it('colors each sector from its Cell', () => {
    const { target } = render(PieFixture, { data, cells: true });
    expect(all(target, 'path.recharts-sector', 'fill')).toEqual(['blue', 'green', 'orange']);
  });

  it('cuts a hole with innerRadius', () => {
    const { target } = render(PieFixture, { data, pieProps: { innerRadius: 60 } });
    expect(target.querySelector('path.recharts-sector')?.getAttribute('d')).toMatch(/A 60,60,0,/);
  });

  it('renders a LabelList child and a Label child', () => {
    const { target } = render(PieFixture, { data, labelList: true, label: true });
    const layer = target.querySelector('.recharts-zIndex-layer_2000');
    expect(texts(layer as HTMLElement, '.recharts-label-list text')).toEqual(['a', 'b', 'c']);
    expect(layer?.querySelector(':scope > text.recharts-label')?.textContent).toBe('center');
  });

  it('renders the label prop with label lines', () => {
    const { target } = render(PieFixture, { data, pieProps: { label: true } });
    // Each label portals into the label layer, which leaves upstream's recharts-pie-labels group empty.
    expect(target.querySelector('.recharts-pie-labels')?.children).toHaveLength(0);
    expect(target.querySelectorAll('.recharts-zIndex-layer_2000 > .recharts-layer')).toHaveLength(3);
    expect(texts(target, 'text.recharts-pie-label-text')).toEqual(['400', '300', '200']);
    expect(target.querySelectorAll('path.recharts-curve.recharts-pie-label-line')).toHaveLength(3);
  });

  it('renders an empty layer when hidden', () => {
    const { target } = render(PieFixture, { data, pieProps: { hide: true } });
    expect(target.querySelector('.recharts-pie')?.children).toHaveLength(0);
    expect(target.querySelector('.recharts-sector')).toBeNull();
  });

  it('sweeps the sectors to their full angles through the entrance animation', () => {
    const settled = all(render(PieFixture, { data }).target, 'path.recharts-sector', 'd');
    const { target } = render(PieFixture, { data, pieProps: { isAnimationActive: true } });
    animate();
    expect(all(target, 'path.recharts-sector', 'd')).toEqual(settled);
  });

  it('shows the hovered sector in the tooltip and draws the activeShape', () => {
    const { target } = render(PieFixture, { data, tooltip: true, pieProps: { activeShape: { fill: 'black' } } });
    target.querySelectorAll('.recharts-pie-sector')[1]?.dispatchEvent(new MouseEvent('mouseenter'));
    settle();
    const tooltip = target.querySelector<HTMLElement>('.recharts-tooltip-wrapper');
    expect(tooltip?.style.visibility).toBe('visible');
    expect(tooltip?.querySelector('.recharts-tooltip-item-name')?.textContent).toBe('b');
    expect(tooltip?.querySelector('.recharts-tooltip-item-value')?.textContent).toBe('300');
    expect(all(target, 'path.recharts-sector', 'fill')).toEqual(['#808080', 'black', '#808080']);
    expect(target.querySelector('.recharts-active-shape path.recharts-sector')?.getAttribute('fill')).toBe('black');
  });
});

describe('Radar', () => {
  it('renders the polygon, the grid and the angle axis', () => {
    const { target } = render(RadarFixture, { data });
    expect(target.querySelector('.recharts-zIndex-layer_100 > .recharts-radar > .recharts-radar-polygon > path.recharts-polygon')?.getAttribute('d')).toBe('M200,44L301.325,258.5L132.45,239L200,44Z');
    expect(target.querySelectorAll('.recharts-zIndex-layer_-100 .recharts-polar-grid-concentric-polygon')).toHaveLength(5);
    expect(target.querySelectorAll('.recharts-polar-grid-angle line')).toHaveLength(3);
    expect(texts(target, '.recharts-polar-angle-axis-tick-value')).toEqual(['a', 'b', 'c']);
    expect(all(target, '.recharts-polar-angle-axis-tick-value', 'text-anchor')).toEqual(['middle', 'start', 'end']);
  });

  it('draws circles for gridType circle', () => {
    const { target } = render(RadarFixture, { data, gridProps: { gridType: 'circle' } });
    expect(target.querySelectorAll('circle.recharts-polar-grid-concentric-circle')).toHaveLength(5);
    expect(target.querySelector('.recharts-polar-grid-concentric-polygon')).toBeNull();
  });

  it('renders dots when asked', () => {
    const { target } = render(RadarFixture, { data, radarProps: { dot: true } });
    expect(target.querySelectorAll('.recharts-radar-dots circle.recharts-dot')).toHaveLength(3);
  });

  it('renders the radius axis ticks', () => {
    const { target } = render(RadarFixture, { data, radiusAxis: true });
    expect(texts(target, '.recharts-polar-radius-axis-tick-value')).toEqual(['0', '100', '200', '300', '400']);
    expect(target.querySelector('.recharts-polar-radius-axis-tick-value')?.getAttribute('transform')).toBe('rotate(30, 200, 200)');
  });

  it('grows the polygon to its full size through the entrance animation', () => {
    const settled = render(RadarFixture, { data }).target.querySelector('path.recharts-polygon')?.getAttribute('d');
    const { target } = render(RadarFixture, { data, radarProps: { isAnimationActive: true } });
    animate();
    expect(target.querySelector('path.recharts-polygon')?.getAttribute('d')).toBe(settled);
  });
});

describe('RadialBar', () => {
  it('renders the sectors in an outer group named recharts-area, as upstream does', () => {
    const { target } = render(RadialBarFixture, { data });
    const sectors = target.querySelectorAll('.recharts-zIndex-layer_300 > .recharts-area > .recharts-layer.recharts-radial-bar-sectors > .recharts-layer > path.recharts-sector');
    expect(sectors).toHaveLength(3);
    expect(sectors[0].getAttribute('class')).toBe('recharts-sector recharts-radial-bar-sector undefined');
  });

  it('renders the background with the literal undefined class', () => {
    const { target } = render(RadialBarFixture, { data, barProps: { background: true } });
    const backgrounds = target.querySelectorAll('.recharts-zIndex-layer_-50 path.recharts-radial-bar-background-sector');
    expect(backgrounds).toHaveLength(3);
    expect(backgrounds[0].getAttribute('class')).toBe('recharts-sector recharts-radial-bar-background-sector undefined');
  });

  it('colors each sector from its Cell', () => {
    const { target } = render(RadialBarFixture, { data, cells: true });
    expect(all(target, 'path.recharts-radial-bar-sector', 'fill')).toEqual(['blue', 'green', 'orange']);
  });

  it('renders insideStart labels along a text path', () => {
    const { target } = render(RadialBarFixture, { data, labelList: true });
    expect(texts(target, '.recharts-label-list text textPath')).toEqual(['a', 'b', 'c']);
  });

  it('rounds the corners with cornerRadius, except on a full circle', () => {
    const { target } = render(RadialBarFixture, { data, barProps: { cornerRadius: 5 } });
    const paths = all(target, 'path.recharts-radial-bar-sector', 'd');
    expect(paths[0]).not.toMatch(/A5,5,0/);
    expect(paths[1]).toMatch(/A5,5,0/);
  });

  // Cells re-registering on every animation frame would restart the animation forever.
  it('settles the entrance animation with Cells and a LabelList', () => {
    const settled = all(render(RadialBarFixture, { data, cells: true, labelList: true }).target, 'path.recharts-radial-bar-sector', 'd');
    const { target } = render(RadialBarFixture, { data, cells: true, labelList: true, barProps: { isAnimationActive: true } });
    animate();
    expect(all(target, 'path.recharts-radial-bar-sector', 'd')).toEqual(settled);
    expect(texts(target, '.recharts-label-list text textPath')).toEqual(['a', 'b', 'c']);
  });

  it('draws a sector cursor on hover', () => {
    const { target } = render(RadialBarFixture, { data, tooltip: true });
    target.querySelector('.recharts-wrapper')?.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 300, clientY: 200 }));
    settle();
    const cursor = target.querySelector('path.recharts-sector.recharts-tooltip-cursor');
    expect(cursor).not.toBeNull();
    expect(target.querySelector<HTMLElement>('.recharts-tooltip-wrapper')?.style.visibility).toBe('visible');
  });
});
