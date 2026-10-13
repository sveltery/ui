import { describe, expect, it } from 'vitest';
import { commandScore, defaultFilter } from '@sveltery/command';
import { rank, step, stepGroup, type GroupEntry, type ItemEntry } from '../../packages/command/src/lib/rank.js';

type Group = GroupEntry & { name: string };
type Item = ItemEntry<Group> & { name: string };

const fruits: Group = { name: 'fruits', forceMount: false };
const tools: Group = { name: 'tools', forceMount: false };
const item = (name: string, group?: Group, options: Partial<Item> = {}): Item => ({
  name,
  value: name,
  keywords: [],
  disabled: false,
  forceMount: false,
  group,
  ...options
});
const apple = item('apple', fruits);
const banana = item('banana', fruits);
const hammer = item('hammer', tools);
const saw = item('saw', tools, { disabled: true });
const pineapple = item('pineapple');
const web = item('web', undefined, { forceMount: true });
const items = [apple, banana, hammer, saw, pineapple, web];
const groups = [fruits, tools];
/** Scores by how early the search appears in the value, 0 when it does not. */
const filter = (value: string, search: string) => (value.includes(search) ? 1 / (1 + value.indexOf(search)) : 0);
const names = (entries: readonly { name: string }[]) => entries.map((entry) => entry.name);

describe('rank', () => {
  it('keeps document order and emits no slots without a search', () => {
    const view = rank({ items, groups, search: '', filter });
    expect(names(view.ordered)).toEqual(['apple', 'banana', 'hammer', 'saw', 'pineapple', 'web']);
    expect(names(view.navigable)).toEqual(['apple', 'banana', 'hammer', 'pineapple', 'web']);
    expect(view.count).toBe(5);
    expect(view.itemSlot.size).toBe(0);
    expect(view.groupSlot.size).toBe(0);
  });

  it('hides non-matches, sorts by score and puts ungrouped items before groups', () => {
    const view = rank({ items, groups, search: 'a', filter });
    // apple 1, banana 1/2, hammer 1/2, saw 1/2, pineapple 1/5, web force-mounted and unscored.
    expect(names(view.ordered)).toEqual(['pineapple', 'web', 'apple', 'banana', 'hammer', 'saw']);
    expect(names(view.navigable)).toEqual(['pineapple', 'web', 'apple', 'banana', 'hammer']);
    expect(view.count).toBe(5);
    expect([...view.itemSlot].map(([entry, slot]) => `${entry.name}:${slot}`)).toEqual([
      'pineapple:1',
      'web:2',
      'apple:1',
      'banana:2',
      'hammer:1',
      'saw:2'
    ]);
    expect([...view.groupSlot].map(([group, slot]) => `${group.name}:${slot}`)).toEqual(['fruits:3', 'tools:4']);
  });

  it('orders groups by their best item and hides empty ones', () => {
    const view = rank({ items, groups, search: 'm', filter });
    expect(names(view.ordered)).toEqual(['web', 'hammer']);
    expect(names(view.groupOrder)).toEqual(['tools']);
    expect(view.visibleGroups.has(fruits)).toBe(false);
    expect(view.visibleItems.has(apple)).toBe(false);
    expect(view.count).toBe(1);
  });

  it('keeps a force-mounted group visible', () => {
    const always: Group = { name: 'always', forceMount: true };
    const view = rank({ items: [item('x', always)], groups: [always], search: 'zzz', filter });
    expect(view.visibleGroups.has(always)).toBe(true);
    expect(view.count).toBe(0);
  });

  it('neither filters nor sorts without a filter', () => {
    const view = rank({ items, groups, search: 'zzz', filter: null });
    expect(names(view.ordered)).toEqual(['apple', 'banana', 'hammer', 'saw', 'pineapple', 'web']);
    expect(view.itemSlot.size).toBe(0);
  });

  it('shows unmeasured items unscored and skips them in navigation', () => {
    const pending = item('pending', undefined, { value: undefined });
    const view = rank({ items: [pending, apple], groups, search: 'a', filter });
    expect(names(view.ordered)).toEqual(['pending', 'apple']);
    expect(names(view.navigable)).toEqual(['apple']);
  });
});

describe('step', () => {
  const list = ['a', 'b', 'c'];
  it('moves one entry and stops at the ends', () => {
    expect(step(list, 'a', 1, false)).toBe('b');
    expect(step(list, 'c', 1, false)).toBe(undefined);
    expect(step(list, 'a', -1, false)).toBe(undefined);
    expect(step(list, undefined, 1, false)).toBe('a');
  });
  it('wraps with loop', () => {
    expect(step(list, 'c', 1, true)).toBe('a');
    expect(step(list, 'a', -1, true)).toBe('c');
    expect(step(list, undefined, -1, true)).toBe('c');
  });
});

describe('stepGroup', () => {
  const view = rank({ items, groups, search: '', filter });
  it('lands on the first navigable item of the next or previous group', () => {
    expect(stepGroup(view, apple, 1, false)?.name).toBe('hammer');
    expect(stepGroup(view, hammer, -1, false)?.name).toBe('apple');
  });
  it('steps one item when no group lies that way or the item is ungrouped', () => {
    expect(stepGroup(view, hammer, 1, false)?.name).toBe('pineapple');
    expect(stepGroup(view, pineapple, -1, false)?.name).toBe('hammer');
  });
});

describe('commandScore', () => {
  it('scores exact, prefix and missing matches', () => {
    expect(commandScore('abc', 'abc')).toBe(1);
    expect(commandScore('html5', 'html')).toBe(0.99);
    expect(commandScore('xyz', 'a')).toBe(0);
  });

  it('prefers word starts, case matches, transpositions and tighter matches as upstream does', () => {
    expect(commandScore('git commit', 'gc')).toBeCloseTo(0.891, 10);
    expect(commandScore('ouch', 'uc')).toBeCloseTo(0.1683, 10);
    expect(commandScore('curtain', 'uc')).toBeCloseTo(0.099, 10);
    expect(commandScore('HTML', 'HM')).toBeGreaterThan(commandScore('haml', 'HM'));
    expect(commandScore('bad', 'bd')).toBeGreaterThan(commandScore('bard', 'bd'));
  });

  it('matches aliases', () => {
    expect(commandScore('Settings', 'pref')).toBe(0);
    expect(commandScore('Settings', 'pref', ['preferences'])).toBeCloseTo(0.891, 10);
  });

  it('ranks a list of commands for a query', () => {
    const commands = ['Open file', 'Close window', 'Toggle sidebar', 'Find in files', 'Format document'];
    const ranked = commands
      .map((command) => [command, defaultFilter(command, 'fi', [])] as const)
      .filter(([, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([command]) => command);
    expect(ranked).toEqual(['Find in files', 'Open file']);
  });
});
