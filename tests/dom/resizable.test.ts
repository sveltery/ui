import { afterAll, afterEach, beforeAll, expect, it } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount } from 'svelte';
import type { ResizableGroupActions, ResizablePanelActions } from '@sveltery/base/resizable';
import ResizableFixture from './ResizableFixture.svelte';
import ResizableHandleChildren from './ResizableHandleChildren.svelte';
import { savedLayout } from './savedLayout.svelte.js';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

// jsdom lays nothing out, so each panel is 100px square, laid end to end along its group, and nothing resizes.
const sizeOf = (element: Element) => (element instanceof HTMLElement && element.dataset.panel ? 100 : 0);
function layOut(element: HTMLElement): DOMRect {
  const parent = element.parentElement;
  if (!parent?.dataset.group) return new DOMRect(0, 0, [...element.children].reduce((total, child) => total + sizeOf(child), 0), 100);
  const offset = [...parent.children].slice(0, [...parent.children].indexOf(element)).reduce((total, child) => total + sizeOf(child), 0);
  return parent.style.flexDirection === 'column' ? new DOMRect(0, offset, 100, sizeOf(element)) : new DOMRect(offset, 0, sizeOf(element), 100);
}
const layout: Record<string, (element: HTMLElement) => unknown> = {
  offsetWidth: sizeOf,
  offsetHeight: sizeOf,
  offsetLeft: (element) => layOut(element).x,
  offsetTop: (element) => layOut(element).y,
  getBoundingClientRect: (element) => () => layOut(element)
};
const native = Object.fromEntries(Object.keys(layout).map((key) => [key, Object.getOwnPropertyDescriptor(HTMLElement.prototype, key) ?? Object.getOwnPropertyDescriptor(Element.prototype, key)!]));
beforeAll(() => {
  for (const [key, read] of Object.entries(layout)) Object.defineProperty(HTMLElement.prototype, key, { configurable: true, get() { return read(this); } });
  globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
});
afterAll(() => {
  for (const [key, descriptor] of Object.entries(native)) Object.defineProperty(HTMLElement.prototype, key, descriptor);
  delete (globalThis as Partial<typeof globalThis>).ResizeObserver;
});

type Fixture = { groupApi(): ResizableGroupActions; panelApi(): ResizablePanelActions; changeLog(): string[] };

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
  expect(group.dataset.group).toBe('true');
  expect(group.dataset.testid).toBe('horizontal');
  const left = byId('left');
  expect(left.dataset.slot).toBe('resizable-panel');
  expect(left.dataset.panel).toBe('true');
  expect(left.dataset.testid).toBe('left');
  expect(left.hasAttribute('class')).toBe(false);
  expect(left.style.overflow).toBe('hidden');
  expect(left.style.display).toBe('flex');
  const content = left.firstElementChild as HTMLElement;
  expect(content.className).toBe('left');
  expect(content.textContent).toBe('Left');
  expect(content.style.flexGrow).toBe('1');
  const handle = byId('handle');
  expect(handle.dataset.slot).toBe('resizable-handle');
  expect(handle.dataset.testid).toBe('handle');
  expect(handle.style.cursor).toBe('');
  expect(handle.style.flexGrow).toBe('0');
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
  expect(fixture.groupApi().getLayout()).toEqual({ left: 30, right: 70 });
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

it('resizes with the arrow keys', () => {
  const { grow, now, press, fixture } = setup();
  press('handle', 'ArrowRight');
  expect(now('handle')).toBe('35');
  expect(grow('left')).toBe('35');
  expect(grow('right')).toBe('65');
  expect(fixture.groupApi().getLayout()).toEqual({ left: 35, right: 65 });
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
  const { grow, now, press, fixture } = setup();
  press('handle', 'Home');
  expect(grow('left')).toBe('0');
  expect(grow('right')).toBe('100');
  expect(now('handle')).toBe('0');
  expect(fixture.panelApi().isCollapsed()).toBe(true);
  press('handle', 'End');
  expect(grow('left')).toBe('80');
  expect(grow('right')).toBe('20');
  expect(fixture.panelApi().isCollapsed()).toBe(false);
  press('handle', 'Enter');
  expect(grow('left')).toBe('0');
  expect(fixture.panelApi().isCollapsed()).toBe(true);
  press('handle', 'Enter');
  expect(grow('left')).toBe('80');
  expect(fixture.groupApi().getLayout()).toEqual({ left: 80, right: 20 });
});

it('leaves a key it does not handle alone and ignores Enter on a panel that cannot collapse', () => {
  const { byId, grow, press } = setup();
  const unhandled = new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true });
  byId('handle').dispatchEvent(unhandled);
  expect(unhandled.defaultPrevented).toBe(false);
  press('vertical-handle', 'Enter');
  expect(grow('top')).toBe('25');
  press('handle', 'ArrowRight');
  expect(byId('handle').getAttribute('aria-valuenow')).toBe('35');
});

it('applies a layout set through the group API after validating it', () => {
  const { grow, now, fixture } = setup();
  expect(fixture.groupApi().setLayout({ left: 60, right: 40 })).toEqual({ left: 60, right: 40 });
  flushSync();
  expect(grow('left')).toBe('60');
  expect(grow('right')).toBe('40');
  expect(now('handle')).toBe('60');
  expect(fixture.groupApi().setLayout({ left: 4, right: 96 })).toEqual({ left: 0, right: 100 });
  flushSync();
  expect(grow('left')).toBe('0');
  expect(fixture.groupApi().getLayout()).toEqual({ left: 0, right: 100 });
});

it('reports each settled layout once', () => {
  const { press, fixture } = setup();
  expect(fixture.changeLog()).toEqual(['{"left":30,"right":70}']);
  press('handle', 'ArrowRight');
  expect(fixture.changeLog()).toEqual(['{"left":30,"right":70}', '{"left":35,"right":65}']);
  press('handle', 'End');
  press('handle', 'End');
  expect(fixture.changeLog().at(-1)).toBe('{"left":80,"right":20}');
  expect(fixture.changeLog().length).toBe(3);
});

it('collapses, expands and resizes a panel through its methods', () => {
  const { grow, fixture } = setup();
  const panel = fixture.panelApi();
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
  const read = () => savedLayout({ id: 'editor', storage });
  const first = read();
  expect(first.defaultLayout).toBeUndefined();
  first.onLayoutChanged({ left: 40, right: 60 });
  expect(store.get('react-resizable-panels:editor')).toBe('{"left":40,"right":60}');
  expect(read().defaultLayout).toEqual({ left: 40, right: 60 });
});

it('a handle renders its grip and drops any children', () => {
  const children = createRawSnippet(() => ({ render: () => '<span class="extra-child">extra</span>' }));
  instance = mount(ResizableHandleChildren, { target: document.body, props: { handleProps: { id: 'handle-with-children', withHandle: true, children } } });
  flushSync();
  const handle = document.getElementById('handle-with-children')!;
  expect([...handle.children].map(child => child.className)).toEqual(['cn-resizable-handle-icon z-10 flex shrink-0']);
});
