import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import { savedLayout } from '@sveltery/resizable';
import ResizableFixture from './ResizableFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

type Fixture = { read(): Record<string, number> | undefined; write(next: Record<string, number>): void; changeLog(): string[]; sideBar(): { collapse(): void; expand(): void; resize(size: string): void; isCollapsed(): boolean; getSize(): { asPercentage: number } } };

function setup() {
  instance = mount(ResizableFixture, { target: document.body });
  flushSync();
  const byId = (id: string) => document.getElementById(id)!;
  const grow = (id: string) => byId(id).style.flexGrow;
  const now = (id: string) => byId(id).getAttribute('aria-valuenow');
  const press = (id: string, key: string) => {
    byId(id).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    flushSync();
  };
  return { byId, grow, now, press, fixture: instance as unknown as Fixture };
}

it('renders the group, panels and handle with the upstream slots and classes', () => {
  const { byId } = setup();
  const group = byId('horizontal');
  expect(group.dataset.slot).toBe('resizable-panel-group');
  expect(group.className).toBe('cn-resizable-panel-group flex h-full w-full aria-[orientation=vertical]:flex-col');
  expect(group.hasAttribute('aria-orientation')).toBe(false);
  expect(group.style.flexDirection).toBe('row');
  expect(byId('vertical').style.flexDirection).toBe('column');
  expect(byId('vertical').classList.contains('extra')).toBe(true);
  const left = byId('left');
  expect(left.dataset.slot).toBe('resizable-panel');
  expect(left.hasAttribute('data-panel')).toBe(true);
  expect(left.classList.contains('left')).toBe(true);
  expect(left.style.overflow).toBe('hidden');
  const handle = byId('handle');
  expect(handle.dataset.slot).toBe('resizable-handle');
  expect(handle.className).toContain('cn-resizable-handle relative flex w-px items-center justify-center bg-border');
  expect(handle.className).toContain('[&[aria-orientation=horizontal]>div]:rotate-90');
  expect(handle.querySelector('div')!.className).toBe('cn-resizable-handle-icon z-10 flex shrink-0');
  expect(byId('vertical-handle').querySelector('div')).toBeNull();
});

it('lays panels out from their default sizes', () => {
  const { grow, fixture } = setup();
  expect(grow('left')).toBe('30');
  expect(grow('right')).toBe('70');
  expect(grow('top')).toBe('25');
  expect(grow('bottom')).toBe('75');
  expect(fixture.read()).toEqual({ left: 30, right: 70 });
});

it('gives the handle the separator role and the value of the panel before it', () => {
  const { byId } = setup();
  const handle = byId('handle');
  expect(handle.getAttribute('role')).toBe('separator');
  expect(handle.getAttribute('aria-orientation')).toBe('vertical');
  expect(handle.getAttribute('aria-controls')).toBe('left');
  expect(handle.getAttribute('aria-valuenow')).toBe('30');
  expect(handle.getAttribute('aria-valuemin')).toBe('0');
  expect(handle.getAttribute('aria-valuemax')).toBe('80');
  expect(handle.getAttribute('tabindex')).toBe('0');
  expect(handle.dataset.separator).toBe('inactive');
  const vertical = byId('vertical-handle');
  expect(vertical.getAttribute('aria-orientation')).toBe('horizontal');
  expect(vertical.getAttribute('aria-controls')).toBe('top');
  expect(vertical.getAttribute('aria-valuenow')).toBe('25');
  expect(vertical.getAttribute('aria-valuemin')).toBe('0');
  expect(vertical.getAttribute('aria-valuemax')).toBe('100');
});

it('resizes with the arrow keys and follows bind:layout', () => {
  const { grow, now, press, fixture } = setup();
  press('handle', 'ArrowRight');
  expect(now('handle')).toBe('35');
  expect(grow('left')).toBe('35');
  expect(grow('right')).toBe('65');
  expect(fixture.read()).toEqual({ left: 35, right: 65 });
  press('handle', 'ArrowLeft');
  press('handle', 'ArrowLeft');
  expect(grow('left')).toBe('25');
  expect(grow('right')).toBe('75');
});

it('resizes a vertical group with ArrowUp and ArrowDown and ignores the horizontal keys', () => {
  const { grow, now, press } = setup();
  press('vertical-handle', 'ArrowDown');
  expect(now('vertical-handle')).toBe('30');
  expect(grow('top')).toBe('30');
  expect(grow('bottom')).toBe('70');
  press('vertical-handle', 'ArrowRight');
  expect(grow('top')).toBe('30');
  press('vertical-handle', 'ArrowUp');
  press('vertical-handle', 'ArrowUp');
  expect(grow('top')).toBe('20');
  expect(grow('bottom')).toBe('80');
});

it('moves to the limits with Home and End and toggles a collapsible panel with Enter', () => {
  const { byId, grow, now, press, fixture } = setup();
  press('handle', 'Home');
  expect(grow('left')).toBe('0');
  expect(grow('right')).toBe('100');
  expect(now('handle')).toBe('0');
  expect(byId('left').hasAttribute('data-collapsed')).toBe(true);
  press('handle', 'End');
  expect(grow('left')).toBe('80');
  expect(grow('right')).toBe('20');
  expect(byId('left').hasAttribute('data-collapsed')).toBe(false);
  press('handle', 'Enter');
  expect(grow('left')).toBe('0');
  expect(byId('left').hasAttribute('data-collapsed')).toBe(true);
  press('handle', 'Enter');
  expect(grow('left')).toBe('80');
  expect(fixture.read()).toEqual({ left: 80, right: 20 });
});

it('leaves a key it does not handle alone and ignores Enter on a panel that cannot collapse', () => {
  const { byId, press } = setup();
  const unhandled = new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true });
  byId('handle').dispatchEvent(unhandled);
  expect(unhandled.defaultPrevented).toBe(false);
  const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
  byId('vertical-handle').dispatchEvent(enter);
  expect(enter.defaultPrevented).toBe(false);
  press('handle', 'ArrowRight');
  expect(byId('handle').getAttribute('aria-valuenow')).toBe('35');
});

it('applies a layout the parent binds', () => {
  const { grow, now, fixture } = setup();
  fixture.write({ left: 60, right: 40 });
  flushSync();
  expect(grow('left')).toBe('60');
  expect(grow('right')).toBe('40');
  expect(now('handle')).toBe('60');
  fixture.write({ left: 4, right: 96 });
  flushSync();
  expect(grow('left')).toBe('0');
  expect(fixture.read()).toEqual({ left: 0, right: 100 });
});

it('reports a settled change with whether the user caused it', () => {
  const { press, fixture } = setup();
  expect(fixture.changeLog()).toEqual(['{"left":30,"right":70} false']);
  press('handle', 'ArrowRight');
  flushSync();
  expect(fixture.changeLog()).toEqual(['{"left":30,"right":70} false', '{"left":35,"right":65} true']);
  press('handle', 'End');
  press('handle', 'End');
  flushSync();
  expect(fixture.changeLog().at(-1)).toBe('{"left":80,"right":20} true');
  expect(fixture.changeLog().length).toBe(3);
});

it('collapses, expands and resizes a panel through its methods', () => {
  const { grow, fixture } = setup();
  const panel = fixture.sideBar();
  expect(panel.isCollapsed()).toBe(false);
  panel.collapse();
  flushSync();
  expect(grow('left')).toBe('0');
  expect(panel.isCollapsed()).toBe(true);
  expect(panel.getSize().asPercentage).toBe(0);
  panel.expand();
  flushSync();
  expect(grow('left')).toBe('30');
  panel.resize('45%');
  flushSync();
  expect(grow('left')).toBe('45');
  expect(grow('right')).toBe('55');
  expect(panel.getSize().asPercentage).toBe(45);
});

it('saves a layout in storage and restores it', () => {
  const store = new Map<string, string>();
  const storage = { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => void store.set(key, value) };
  const first = savedLayout({ id: 'editor', storage });
  expect(first.id).toBe('editor');
  expect(first.defaultLayout).toBeUndefined();
  first.onLayoutChanged({ left: 40, right: 60 });
  expect(store.get('sveltery-resizable:editor')).toBe('{"left":40,"right":60}');
  expect(savedLayout({ id: 'editor', storage }).defaultLayout).toEqual({ left: 40, right: 60 });
});

it('ignores storage that is unreadable, malformed or blocked', () => {
  const blocked = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
  const saved = savedLayout({ id: 'editor', storage: blocked });
  expect(saved.defaultLayout).toBeUndefined();
  expect(() => saved.onLayoutChanged({ left: 40, right: 60 })).not.toThrow();
  for (const stored of ['not json', '[1,2]', '{"left":"wide"}', 'null']) {
    expect(savedLayout({ id: 'editor', storage: { getItem: () => stored, setItem: () => {} } }).defaultLayout).toBeUndefined();
  }
});
