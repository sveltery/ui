import { untrack } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import { setMargin } from '../../src/state/layoutSlice.js';
import type { RechartsRootState } from '../../src/state/store.js';
import DataChart from './fixtures/DataChart.svelte';
import ProbeChart from './fixtures/ProbeChart.svelte';
import RegistrationChart from './fixtures/RegistrationChart.svelte';
import SelectorProbe, { type ProbeApi } from './fixtures/SelectorProbe.svelte';
import { render, settle } from './mount.js';

function probe<T>() {
  let api: ProbeApi<T> | undefined;
  return {
    onready: (next: ProbeApi<T>) => {
      api = next;
    },
    get api(): ProbeApi<T> {
      if (!api) throw new Error('The probe did not mount.');
      return api;
    },
  };
}

describe('useAppSelector', () => {
  it('reads undefined outside a chart without calling the selector', () => {
    const selector = vi.fn((state: RechartsRootState) => state.layout.width);
    const p = probe<number>();
    render(SelectorProbe<number>, { selector, onready: p.onready });
    expect(p.api.box.current).toBe(undefined);
    expect(selector).not.toHaveBeenCalled();
  });

  it('dispatches nothing outside a chart', () => {
    const p = probe<number>();
    render(SelectorProbe<number>, { selector: (state) => state.layout.width, onready: p.onready });
    const action = setMargin({ top: 1 });
    expect(p.api.dispatch(action)).toBe(action);
  });

  it('reads the selected value inside a chart', () => {
    const p = probe<number>();
    render(ProbeChart<number>, { selector: (state) => state.layout.width, onready: p.onready });
    expect(p.api.box.current).toBe(500);
  });

  it('re-runs dependents only when the selected value changes', () => {
    const p = probe<number>();
    render(ProbeChart<number>, { selector: (state) => state.layout.margin.top, onready: p.onready });
    expect(p.api.box.current).toBe(5);
    const runs = p.api.runs();

    p.api.dispatch(setMargin({ top: 5, right: 5, bottom: 5, left: 40 }));
    settle();
    expect(p.api.runs()).toBe(runs);

    p.api.dispatch(setMargin({ top: 20, right: 5, bottom: 5, left: 40 }));
    settle();
    expect(p.api.box.current).toBe(20);
    expect(p.api.runs()).toBe(runs + 1);
  });

  it('reads the store directly when untracked, before the batched notification', () => {
    const p = probe<number>();
    render(ProbeChart<number>, { selector: (state) => state.layout.margin.top, onready: p.onready });
    p.api.dispatch(setMargin({ top: 30 }));
    expect(untrack(() => p.api.box.current)).toBe(30);
    settle();
  });
});

describe('useRegistration', () => {
  const ids = (items: ReadonlyArray<{ id: string }> | undefined) => items?.map((item) => item.id);

  it('adds items in declaration order', () => {
    const p = probe<RechartsRootState['graphicalItems']['cartesianItems']>();
    render(RegistrationChart, { onready: p.onready });
    expect(ids(p.api.box.current)).toEqual(['a', 'b', 'c']);
  });

  it('replaces a changed item at its index', () => {
    const p = probe<RechartsRootState['graphicalItems']['cartesianItems']>();
    const { instance } = render(RegistrationChart, { onready: p.onready });
    instance.setDataKey('a', 'changed');
    settle();
    expect(p.api.box.current?.map((item) => [item.id, item.dataKey])).toEqual([
      ['a', 'changed'],
      ['b', 'pv'],
      ['c', 'amt'],
    ]);
  });

  it('removes an item when its component is destroyed', () => {
    const p = probe<RechartsRootState['graphicalItems']['cartesianItems']>();
    const { instance } = render(RegistrationChart, { onready: p.onready });
    instance.remove('b');
    settle();
    expect(ids(p.api.box.current)).toEqual(['a', 'c']);
  });
});

describe('the immer freeze guard', () => {
  it('accepts $state data and leaves it unfrozen', () => {
    const p = probe<unknown>();
    render(DataChart, { onready: p.onready });
    expect(p.api.box.current).toEqual([
      { name: 'a', uv: 1 },
      { name: 'b', uv: 2 },
    ]);
  });

  it('dispatches again when the caller mutates its $state data', () => {
    const p = probe<unknown>();
    const { instance } = render(DataChart, { onready: p.onready });
    instance.setUv(0, 7);
    settle();
    expect(p.api.box.current).toEqual([
      { name: 'a', uv: 7 },
      { name: 'b', uv: 2 },
    ]);
    instance.push('c', 3);
    settle();
    expect(p.api.box.current).toEqual([
      { name: 'a', uv: 7 },
      { name: 'b', uv: 2 },
      { name: 'c', uv: 3 },
    ]);
  });
});
