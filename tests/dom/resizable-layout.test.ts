import { expect, it } from 'vitest';
import { adjustLayoutByDelta, clampPanelSize, resolveLayout, separatorRange, validateLayout, type PanelConstraints } from '../../packages/resizable/src/lib/layout.js';
import { toPercent, type UnitContext } from '../../packages/resizable/src/lib/units.js';

const panel = (overrides: Partial<PanelConstraints> = {}): PanelConstraints => ({ collapsible: false, collapsedSize: 0, minSize: 0, maxSize: 100, defaultSize: undefined, ...overrides });
const collapsible = (minSize: number, collapsedSize = 0) => panel({ collapsible: true, minSize, collapsedSize });

it('clamps a panel to its minimum and maximum', () => {
  expect(clampPanelSize(panel({ minSize: 10 }), 5, 30)).toBe(10);
  expect(clampPanelSize(panel({ maxSize: 60 }), 80, 30)).toBe(60);
  expect(clampPanelSize(panel({ minSize: 10, maxSize: 60 }), 33.33333, 30)).toBe(33.333);
});

it('collapses a collapsible panel below the midpoint between collapsed and minimum', () => {
  const constraints = collapsible(20);
  expect(clampPanelSize(constraints, 9, 30)).toBe(0);
  expect(clampPanelSize(constraints, 10, 30)).toBe(20);
  expect(clampPanelSize(constraints, 12, 30)).toBe(20);
  expect(clampPanelSize(constraints, 9, 0)).toBe(0);
  expect(clampPanelSize(constraints, 10, 0)).toBe(20);
  expect(clampPanelSize(collapsible(25, 5), 14, 40)).toBe(5);
  expect(clampPanelSize(collapsible(25, 5), 15, 40)).toBe(25);
});

it('validates a layout by scaling it to 100 and clamping every panel', () => {
  expect(validateLayout([30, 30], [panel(), panel()])).toEqual([50, 50]);
  expect(validateLayout([20, 20, 20], [panel(), panel(), panel()])).toEqual([33.334, 33.333, 33.333]);
  expect(validateLayout([10, 90], [panel(), panel({ maxSize: 60 })])).toEqual([40, 60]);
  expect(validateLayout([95, 5], [panel(), panel({ minSize: 20 })])).toEqual([80, 20]);
});

it('adjusts a layout by a delta between two panels', () => {
  const constraints = [panel(), panel()];
  const adjust = (layout: number[], delta: number) => adjustLayoutByDelta({ layout, constraints, pivot: [0, 1], delta, trigger: 'pointer' });
  expect(adjust([50, 50], 10)).toEqual([60, 40]);
  expect(adjust([50, 50], -20)).toEqual([30, 70]);
  expect(adjust([50, 50], 0)).toEqual([50, 50]);
  expect(adjust([50, 50], 70)).toEqual([100, 0]);
  expect(adjust([50, 50], -70)).toEqual([0, 100]);
});

it('stops at a minimum and a maximum', () => {
  const pointer = (layout: number[], constraints: PanelConstraints[], delta: number) => adjustLayoutByDelta({ layout, constraints, pivot: [0, 1], delta, trigger: 'pointer' });
  expect(pointer([50, 50], [panel(), panel({ minSize: 30 })], 40)).toEqual([70, 30]);
  expect(pointer([50, 50], [panel({ minSize: 35 }), panel()], -40)).toEqual([35, 65]);
  expect(pointer([50, 50], [panel({ maxSize: 60 }), panel()], 30)).toEqual([60, 40]);
});

it('passes the rest of a move to the next panels once a panel reaches its minimum', () => {
  const constraints = [panel(), panel({ minSize: 20 }), panel()];
  expect(adjustLayoutByDelta({ layout: [30, 30, 40], constraints, pivot: [0, 1], delta: 25, trigger: 'pointer' })).toEqual([55, 20, 25]);
  expect(adjustLayoutByDelta({ layout: [40, 30, 30], constraints, pivot: [1, 2], delta: -25, trigger: 'pointer' })).toEqual([25, 20, 55]);
});

it('collapses a collapsible panel dragged below half its minimum and keeps it above', () => {
  const constraints = [collapsible(20), panel()];
  const drag = (layout: number[], delta: number) => adjustLayoutByDelta({ layout, constraints, pivot: [0, 1], delta, trigger: 'pointer' });
  expect(drag([40, 60], -25)).toEqual([20, 80]);
  expect(drag([40, 60], -35)).toEqual([0, 100]);
  expect(drag([0, 100], 5)).toEqual([0, 100]);
  expect(drag([0, 100], 12)).toEqual([20, 80]);
});

it('collapses and expands a collapsible panel in one keyboard step', () => {
  const constraints = [collapsible(20), panel()];
  const press = (layout: number[], delta: number) => adjustLayoutByDelta({ layout, constraints, pivot: [0, 1], delta, trigger: 'keyboard' });
  expect(press([30, 70], -5)).toEqual([25, 75]);
  expect(press([20, 80], -5)).toEqual([0, 100]);
  expect(press([0, 100], 5)).toEqual([20, 80]);
  expect(press([20, 80], 5)).toEqual([25, 75]);
});

it('resolves a layout from requested sizes, default sizes and an equal share of the rest', () => {
  const withDefault = [panel({ defaultSize: 30 }), panel(), panel()];
  expect(resolveLayout(['a', 'b', 'c'], withDefault, {})).toEqual([30, 35, 35]);
  expect(resolveLayout(['a', 'b', 'c'], withDefault, { a: 50 })).toEqual([50, 25, 25]);
  expect(resolveLayout(['a', 'b'], [panel(), panel()], {})).toEqual([50, 50]);
  expect(resolveLayout(['a', 'b'], [panel(), panel({ minSize: 40 })], { a: 90, b: 10 })).toEqual([60, 40]);
  expect(resolveLayout([], [], {})).toEqual([]);
});

it('reports the value and bounds of the panel before a separator', () => {
  const constraints = [panel({ minSize: 20, maxSize: 70 }), panel({ minSize: 10 })];
  expect(separatorRange([50, 50], constraints, 0)).toEqual({ now: 50, min: 20, max: 70 });
  expect(separatorRange([50, 50], [panel({ minSize: 20, maxSize: 70 }), panel({ minSize: 40 })], 0)).toEqual({ now: 50, min: 20, max: 60 });
  expect(separatorRange([50, 50], [collapsible(20), panel()], 0)).toEqual({ now: 50, min: 0, max: 100 });
});

const context: UnitContext = { groupSize: 800, fontSize: 20, rootFontSize: 16, viewportWidth: 1000, viewportHeight: 500 };

it('converts sizes to percent of the group', () => {
  expect(toPercent('25%', context)).toBe(25);
  expect(toPercent('25', context)).toBe(25);
  expect(toPercent(200, context)).toBe(25);
  expect(toPercent('200px', context)).toBe(25);
  expect(toPercent('2rem', context)).toBe(4);
  expect(toPercent('1em', context)).toBe(2.5);
  expect(toPercent('50vh', context)).toBe(31.25);
  expect(toPercent('50vw', context)).toBe(62.5);
  expect(toPercent(' 12.5 % ', context)).toBe(12.5);
});

it('leaves absolute units unresolved until the group has a size', () => {
  const unmeasured = { ...context, groupSize: 0 };
  expect(toPercent('30%', unmeasured)).toBe(30);
  expect(toPercent('200px', unmeasured)).toBeUndefined();
  expect(toPercent('2rem', unmeasured)).toBeUndefined();
});

it('rejects a size it cannot read', () => {
  expect(() => toPercent('wide', context)).toThrow('Invalid size "wide"');
});
