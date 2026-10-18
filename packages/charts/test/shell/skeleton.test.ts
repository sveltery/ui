import { describe, expect, it } from 'vitest';
import BarChart from '../../src/chart/BarChart.svelte';
import PieChart from '../../src/chart/PieChart.svelte';
import { render } from './mount.js';

type Shape = [tag: string, attributes: Record<string, string>, ...children: Shape[]];

/** An element as a literal: tag, attributes, children. Comment and whitespace nodes are not elements, so they are checked separately. */
function shape(element: Element): Shape {
  const attributes = Object.fromEntries(element.getAttributeNames().map((name) => [name, element.getAttribute(name) ?? '']));
  return [element.tagName, attributes, ...[...element.children].map(shape)];
}

const LAYER = (zIndex: number): Shape => ['g', { tabindex: '-1', class: `recharts-zIndex-layer_${zIndex}` }];

/** What recharts 3.8.0 renders inside the svg of an empty chart: 12 layers, with the clip path between -50 and 100. */
const SVG_CHILDREN = (clipId: string): Shape[] => [
  ['title', {}],
  ['desc', {}],
  LAYER(-100),
  LAYER(-50),
  ['defs', {}, ['clipPath', { id: clipId }, ['rect', { x: '5', y: '5', height: '290', width: '490' }]]],
  ...[100, 200, 300, 400, 500, 600, 1000, 1100, 1200, 2000].map(LAYER),
];

const WRAPPER = { width: '500', height: '300', class: 'recharts-wrapper', style: 'position: relative; cursor: default; width: 500px; height: 300px;' };
const SURFACE = { class: 'recharts-surface', width: '500', height: '300', style: 'width: 100%; height: 100%; display: block;', viewBox: '0 0 500 300' };

function clipId(target: Element): string {
  return target.querySelector('clipPath')?.id ?? '';
}

describe('the empty chart skeleton', () => {
  const data = [{ name: 'a', uv: 1 }];

  it('renders BarChart like recharts', () => {
    const { target } = render(BarChart, { width: 500, height: 300, data });
    expect(clipId(target)).toMatch(/^recharts\d+-clip$/);
    expect([...target.children].map(shape)).toEqual([['DIV', WRAPPER, ['svg', { role: 'application', tabindex: '0', ...SURFACE }, ...SVG_CHILDREN(clipId(target))]]]);
  });

  it('drops role and tabindex without the accessibility layer', () => {
    const { target } = render(BarChart, { width: 500, height: 300, data, accessibilityLayer: false });
    expect([...target.children].map(shape)).toEqual([['DIV', WRAPPER, ['svg', SURFACE, ...SVG_CHILDREN(clipId(target))]]]);
  });

  it('renders PieChart like recharts, with the cx and cy defaults on the svg', () => {
    const { target } = render(PieChart, { width: 500, height: 300 });
    expect([...target.children].map(shape)).toEqual([['DIV', WRAPPER, ['svg', { cx: '50%', cy: '50%', role: 'application', tabindex: '0', ...SURFACE }, ...SVG_CHILDREN(clipId(target))]]]);
  });

  it('writes the wrapper attributes in the order react-dom does', () => {
    const { target } = render(BarChart, { width: 500, height: 300, data });
    expect(target.firstElementChild?.getAttributeNames()).toEqual(['width', 'height', 'class', 'style']);
  });

  it('adds no text, since Svelte anchors with comments and empty text nodes', () => {
    const { target } = render(BarChart, { width: 500, height: 300, data });
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
    const texts: string[] = [];
    while (walker.nextNode()) texts.push(walker.currentNode.textContent ?? '');
    expect(texts.filter((text) => text !== '')).toEqual([]);
  });

  it('renders nothing inside the wrapper while the size is not positive', () => {
    const { target } = render(BarChart, { width: 0, height: 300, data });
    expect([...target.children].map(shape)).toEqual([['DIV', { width: '0', height: '300', class: 'recharts-wrapper', style: 'position: relative; cursor: default; width: 0px; height: 300px;' }]]);
  });

  it('passes class and style through to the wrapper', () => {
    const { target } = render(BarChart, { width: 500, height: 300, data, class: 'mine', style: { background: 'red' } });
    expect(shape(target.firstElementChild!)[1]).toEqual({
      width: '500',
      height: '300',
      class: 'recharts-wrapper mine',
      style: 'position: relative; cursor: default; width: 500px; height: 300px; background: red;',
    });
  });
});
