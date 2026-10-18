import { describe, expect, it } from 'vitest';
import type { CellEntry } from '../../src/component/Cell.hooks.svelte.js';
import { Cell } from '../../src/component/Cell.js';
import type { Box } from '../../src/state/hooks.svelte.js';
import CellHarness from './fixtures/CellHarness.svelte';
import LayerChart from './fixtures/LayerChart.svelte';
import PortalHarness from './fixtures/PortalHarness.svelte';
import { markup, render, settle } from './mount.js';

describe('Cell registration', () => {
  function cells() {
    let box: Box<ReadonlyArray<CellEntry>> | undefined;
    return {
      onready: (next: Box<ReadonlyArray<CellEntry>>) => {
        box = next;
      },
      get props() {
        return box?.current.map((cell) => cell.props);
      },
      get types() {
        return box?.current.map((cell) => cell.type);
      },
    };
  }

  it('registers cells in declaration order, shaped like the elements upstream reads', () => {
    const c = cells();
    render(CellHarness, { onready: c.onready });
    expect(c.props).toEqual([
      { fill: 'red', className: 'cell-0' },
      { fill: 'green', className: 'cell-1' },
      { fill: 'blue', className: 'cell-2' },
    ]);
    expect(c.types).toEqual([Cell, Cell, Cell]);
  });

  it('keeps a cell at its index when its props change', () => {
    const c = cells();
    const { instance } = render(CellHarness, { onready: c.onready });
    instance.setFill(1, 'black');
    settle();
    expect(c.props?.map((p) => p.fill)).toEqual(['red', 'black', 'blue']);
  });

  it('follows the list as it grows and shrinks', () => {
    const c = cells();
    const { instance } = render(CellHarness, { onready: c.onready });
    instance.setFills(['red', 'green', 'blue', 'white']);
    settle();
    expect(c.props?.map((p) => p.fill)).toEqual(['red', 'green', 'blue', 'white']);
    instance.setFills(['red']);
    settle();
    expect(c.props?.map((p) => p.fill)).toEqual(['red']);
  });
});

describe('Portal', () => {
  it('renders its content into the target with the contexts of where it is declared', () => {
    const target = document.createElement('div');
    document.body.append(target);
    const { instance } = render(PortalHarness, { target });
    expect(markup(target)).toBe('<span class="portalled">first</span>');
    instance.setLabel('second');
    settle();
    expect(markup(target)).toBe('<span class="portalled">second</span>');
    target.remove();
  });

  it('removes its content from the target when it is destroyed', () => {
    const target = document.createElement('div');
    document.body.append(target);
    const { instance } = render(PortalHarness, { target });
    instance.setOpen(false);
    settle();
    expect(markup(target)).toBe('');
    target.remove();
  });
});

describe('ZIndexLayer', () => {
  const parentOfProbe = (target: Element) => {
    return target.querySelector('rect.probe')?.parentElement?.getAttribute('class');
  };

  it('moves its content into the layer of its zIndex', () => {
    const { target } = render(LayerChart, {});
    expect(parentOfProbe(target)).toBe('recharts-zIndex-layer_100');
    expect(target.querySelector('rect.probe')?.namespaceURI).toBe('http://www.w3.org/2000/svg');
  });

  it('follows a zIndex change and renders in place at zIndex 0', () => {
    const { target, instance } = render(LayerChart, {});
    instance.setZIndex(-50);
    settle();
    expect(parentOfProbe(target)).toBe('recharts-zIndex-layer_-50');
    instance.setZIndex(0);
    settle();
    expect(parentOfProbe(target)).toBe('recharts-surface');
    expect(target.querySelector('rect.probe')?.previousElementSibling?.tagName).toBe('defs');
  });

  it('removes its content from the layer when it is destroyed', () => {
    const { target, instance } = render(LayerChart, {});
    instance.setOpen(false);
    settle();
    expect(target.querySelectorAll('rect.probe').length).toBe(0);
    expect(target.querySelectorAll('g[class^=recharts-zIndex-layer_]').length).toBe(12);
  });

  it('adds a layer for a zIndex no default layer has, and removes it after', () => {
    const { target, instance } = render(LayerChart, {});
    instance.setZIndex(150);
    settle();
    expect([...target.querySelectorAll('g[class^=recharts-zIndex-layer_]')].map((g) => g.getAttribute('class')?.slice('recharts-zIndex-layer_'.length))).toEqual([
      '-100', '-50', '100', '150', '200', '300', '400', '500', '600', '1000', '1100', '1200', '2000',
    ]);
    expect(parentOfProbe(target)).toBe('recharts-zIndex-layer_150');
    instance.setOpen(false);
    settle();
    expect(target.querySelectorAll('g[class^=recharts-zIndex-layer_]').length).toBe(12);
  });
});
