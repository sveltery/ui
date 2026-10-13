import { afterEach, describe, expect, it, onTestFinished, vi } from 'vitest';
import { flushSync, mount, tick, unmount } from 'svelte';
import CommandDuplicateFixture from './CommandDuplicateFixture.svelte';
import CommandDynamicFixture from './CommandDynamicFixture.svelte';
import CommandFixture from './CommandFixture.svelte';

type Bound = { bound(): { value: string; search: string }; setValue(value: string): void };
type Dynamic = Bound & { setItems(items: string[]): void; setText(text: string): void; setBroken(broken: boolean): void };

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => {
  if (instance) await unmount(instance);
  instance = undefined;
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function setup(props: Record<string, unknown> = {}) {
  instance = mount(CommandFixture, { target: document.body, props });
  flushSync();
  return instance as unknown as Bound;
}

function setupDynamic(props: Record<string, unknown> = {}) {
  instance = mount(CommandDynamicFixture, { target: document.body, props });
  flushSync();
  return instance as unknown as Dynamic;
}

function setupDuplicates(props: Record<string, unknown> = {}) {
  instance = mount(CommandDuplicateFixture, { target: document.body, props });
  flushSync();
  return instance as unknown as Bound;
}

/** Records the elements scrollIntoView is called on, by test id or else text. jsdom has no scrollIntoView. */
function recordScrolls() {
  const scrolled: string[] = [];
  Element.prototype.scrollIntoView = function (this: HTMLElement) {
    scrolled.push(this.dataset.testid ?? this.textContent!);
  };
  onTestFinished(() => {
    delete (Element.prototype as Partial<Element>).scrollIntoView;
  });
  return scrolled;
}

function el<T extends HTMLElement = HTMLElement>(testId: string) {
  const element = document.querySelector<T>(`[data-testid="${testId}"]`);
  if (!element) throw new Error(`Missing test element: ${testId}`);
  return element;
}
const input = () => el<HTMLInputElement>('input');
const query = (testId: string) => document.querySelector(`[data-testid="${testId}"]`);

function type(value: string) {
  const element = input();
  element.focus();
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  flushSync();
}
function press(key: string, options: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, ...options });
  input().dispatchEvent(event);
  flushSync();
  return event;
}
function pointer(testId: string) {
  el(testId).dispatchEvent(new PointerEvent('pointermove', { bubbles: true }));
  flushSync();
}
function click(testId: string) {
  el(testId).click();
  flushSync();
}

/** The test id of the item aria-activedescendant points at. */
function active() {
  const id = input().getAttribute('aria-activedescendant');
  return id ? document.getElementById(id)?.dataset.testid : undefined;
}
/** The test ids of the items marked selected. */
const selected = () => [...document.querySelectorAll<HTMLElement>('[cmdk-item][aria-selected="true"]')].map((item) => item.dataset.testid);

/** Lays out the list the way a browser does: hidden children dropped, then a stable sort by CSS `order`. */
function laidOut(container: Element): HTMLElement[] {
  return [...container.children]
    .filter((child): child is HTMLElement => child instanceof HTMLElement && !child.hidden)
    .map((child, index) => ({ child, index, order: Number(child.style.order || 0) }))
    .sort((a, b) => a.order - b.order || a.index - b.index)
    .flatMap(({ child }) => {
      if (child.hasAttribute('cmdk-item')) return [child];
      const items = child.querySelector(':scope > [cmdk-group-items]');
      return items ? laidOut(items) : [];
    });
}
const visualOrder = () => laidOut(document.querySelector('[cmdk-list-sizer]')!).map((item) => item.dataset.testid);

/** Walks the selection with ArrowDown from the first item and records where it lands, until it stops moving. */
function keyboardOrder() {
  press('Home');
  const order = [active()];
  while (order.length <= document.querySelectorAll('[cmdk-item]').length) {
    press('ArrowDown');
    const next = active();
    if (next === order.at(-1)) return order;
    order.push(next);
  }
  return order;
}

describe('Command', () => {
  it('renders the cmdk anatomy and wires its ARIA', () => {
    setup();
    const root = el('root');
    const label = root.querySelector('[cmdk-label]')!;
    const list = el('list');
    const fruits = el('fruits');
    const heading = fruits.querySelector('[cmdk-group-heading]')!;
    const items = fruits.querySelector('[cmdk-group-items]')!;

    expect(root.hasAttribute('cmdk-root')).toBe(true);
    expect(root.getAttribute('tabindex')).toBe('-1');
    expect(root.className).toBe('menu');
    expect(label.textContent).toBe('Command menu');
    expect(label.getAttribute('for')).toBe(input().id);
    expect((label as HTMLElement).style.position).toBe('absolute');
    expect(input().hasAttribute('cmdk-input')).toBe(true);
    expect(input().getAttribute('role')).toBe('combobox');
    expect(input().getAttribute('aria-autocomplete')).toBe('list');
    expect(input().getAttribute('aria-expanded')).toBe('true');
    expect(input().getAttribute('aria-controls')).toBe(list.id);
    expect(input().getAttribute('aria-labelledby')).toBe(label.id);
    expect(input().getAttribute('autocomplete')).toBe('off');
    expect(input().getAttribute('autocorrect')).toBe('off');
    expect(input().getAttribute('spellcheck')).toBe('false');
    expect(input().type).toBe('text');
    expect(input().placeholder).toBe('Type a command');
    expect(list.hasAttribute('cmdk-list')).toBe(true);
    expect(list.getAttribute('role')).toBe('listbox');
    expect(list.getAttribute('aria-label')).toBe('Suggestions');
    expect(list.getAttribute('tabindex')).toBe('-1');
    // Their flex layout comes from a zero-specificity stylesheet, so author CSS can replace it.
    expect(list.querySelector('[cmdk-list-sizer]')!.getAttribute('style')).toBe(null);
    expect(items.getAttribute('style')).toBe(null);
    expect(fruits.getAttribute('role')).toBe('presentation');
    expect(fruits.dataset.value).toBe('Fruits');
    expect(heading.textContent).toBe('Fruits');
    expect(heading.getAttribute('aria-hidden')).toBe('true');
    expect(items.getAttribute('role')).toBe('group');
    expect(items.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(el('apple').getAttribute('role')).toBe('option');
    expect(el('apple').dataset.value).toBe('Apple');
    expect(el('settings').dataset.value).toBe('Settings');
    expect(el('pineapple').dataset.value).toBe('pineapple');
    expect(el('cabbage').getAttribute('aria-disabled')).toBe('true');
    expect(el('cabbage').dataset.disabled).toBe('true');
    expect(el('carrot').getAttribute('aria-disabled')).toBe('false');
    expect(el('carrot').dataset.disabled).toBe('false');
    expect(el('separator').getAttribute('role')).toBe('separator');
    expect(query('empty')).toBe(null);
  });

  it('selects the first item on mount and reports it', () => {
    const onValueChange = vi.fn();
    const fixture = setup({ onValueChange });
    expect(fixture.bound().value).toBe('Apple');
    expect(onValueChange.mock.calls).toEqual([['Apple']]);
    expect(input().getAttribute('aria-activedescendant')).toBe(el('apple').id);
    expect(el('list').getAttribute('aria-activedescendant')).toBe(el('apple').id);
    expect(el('apple').getAttribute('aria-selected')).toBe('true');
    expect(el('apple').dataset.selected).toBe('true');
    expect(el('banana').getAttribute('aria-selected')).toBe('false');
    expect(el('banana').dataset.selected).toBe('false');
  });

  it('walks items in document order with the arrow keys, skipping disabled ones', () => {
    const fixture = setup();
    expect(keyboardOrder()).toEqual(['apple', 'banana', 'pineapple', 'carrot', 'asparagus', 'settings']);
    expect(press('ArrowDown').defaultPrevented).toBe(true);
    expect(active()).toBe('settings');
    press('ArrowUp');
    expect(active()).toBe('asparagus');
    press('ArrowUp');
    expect(active()).toBe('carrot');
    expect(fixture.bound().value).toBe('Carrot');
    press('Home');
    press('ArrowUp');
    expect(active()).toBe('apple');
  });

  it('wraps around the ends with loop', () => {
    setup({ loop: true });
    press('ArrowUp');
    expect(active()).toBe('settings');
    press('ArrowDown');
    expect(active()).toBe('apple');
  });

  it('jumps to the ends with Home, End and Meta+Arrow', () => {
    setup();
    expect(press('End').defaultPrevented).toBe(true);
    expect(active()).toBe('settings');
    press('Home');
    expect(active()).toBe('apple');
    press('ArrowDown', { metaKey: true });
    expect(active()).toBe('settings');
    press('ArrowUp', { metaKey: true });
    expect(active()).toBe('apple');
  });

  it('jumps between groups with Alt+Arrow', () => {
    setup();
    press('ArrowDown', { altKey: true });
    expect(active()).toBe('carrot');
    // No group follows, so Alt+Down steps one item like cmdk.
    press('ArrowDown', { altKey: true });
    expect(active()).toBe('asparagus');
    press('ArrowUp', { altKey: true });
    expect(active()).toBe('apple');
    press('End');
    press('ArrowUp', { altKey: true });
    expect(active()).toBe('asparagus');
  });

  it('moves with the vim bindings unless they are turned off', () => {
    setup();
    press('n', { ctrlKey: true });
    expect(active()).toBe('banana');
    press('j', { ctrlKey: true });
    expect(active()).toBe('pineapple');
    press('k', { ctrlKey: true });
    expect(active()).toBe('banana');
    press('p', { ctrlKey: true });
    expect(active()).toBe('apple');
    press('j', { ctrlKey: true, metaKey: true });
    expect(active()).toBe('settings');
    expect(press('j').defaultPrevented).toBe(false);
    expect(active()).toBe('settings');
  });

  it('ignores the vim bindings when vimBindings is false', () => {
    setup({ vimBindings: false });
    expect(press('n', { ctrlKey: true }).defaultPrevented).toBe(false);
    press('j', { ctrlKey: true });
    expect(active()).toBe('apple');
  });

  it('ignores keys another handler prevented and keys an input method is composing', () => {
    setup();
    input().addEventListener('keydown', (event) => event.key === 'ArrowDown' && event.preventDefault(), { once: true });
    press('ArrowDown');
    expect(active()).toBe('apple');
    expect(press('ArrowDown', { isComposing: true }).defaultPrevented).toBe(false);
    expect(active()).toBe('apple');
    press('ArrowDown');
    expect(active()).toBe('banana');
  });

  it('calls onSelect with the value on Enter and on click', () => {
    const onSelect = vi.fn();
    const fixture = setup({ onSelect });
    press('ArrowDown');
    expect(press('Enter').defaultPrevented).toBe(true);
    expect(onSelect.mock.calls).toEqual([['Banana']]);
    click('settings');
    expect(onSelect.mock.calls).toEqual([['Banana'], ['Settings']]);
    expect(fixture.bound().value).toBe('Settings');
    expect(active()).toBe('settings');
    click('cabbage');
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(active()).toBe('settings');
  });

  it('selects on pointer movement except over disabled items', () => {
    setup();
    pointer('carrot');
    expect(active()).toBe('carrot');
    pointer('cabbage');
    expect(active()).toBe('carrot');
    expect(selected()).toEqual(['carrot']);
  });

  it('ignores pointer movement with disablePointerSelection', () => {
    setup({ disablePointerSelection: true });
    pointer('carrot');
    expect(active()).toBe('apple');
  });

  it('filters, ranks and selects the best match as the search changes', () => {
    const onValueChange = vi.fn();
    const fixture = setup({ onValueChange });
    type('c');

    expect(fixture.bound().search).toBe('c');
    expect(el('apple').hidden).toBe(true);
    expect(el('apple').style.display).toBe('none');
    expect(el('banana').hidden).toBe(true);
    expect(el('asparagus').hidden).toBe(true);
    expect(el('carrot').hidden).toBe(false);
    expect(el('cabbage').hidden).toBe(false);
    expect(el('pineapple').hidden).toBe(false);
    // "Settings" matches through its "preferences" keyword. Ungrouped matches come before groups.
    expect(el('settings').style.order).toBe('1');
    expect(el('vegetables').style.order).toBe('2');
    expect(el('fruits').style.order).toBe('3');
    expect(el('carrot').style.order).toBe('1');
    expect(el('cabbage').style.order).toBe('2');
    expect(el('pineapple').style.order).toBe('1');
    expect(query('separator')).toBe(null);
    expect(query('empty')).toBe(null);
    expect(visualOrder()).toEqual(['settings', 'carrot', 'cabbage', 'pineapple']);
    expect(fixture.bound().value).toBe('Settings');
    expect(onValueChange.mock.calls).toEqual([['Apple'], ['Settings']]);
    expect(el('state').textContent).toBe(`c|Settings|4|${el('settings').id}`);
    expect(keyboardOrder()).toEqual(['settings', 'carrot', 'pineapple']);
  });

  it('orders groups by their best match and hides groups without matches', () => {
    setup();
    type('ap');
    expect(visualOrder()).toEqual(['apple', 'pineapple', 'asparagus']);
    expect(keyboardOrder()).toEqual(['apple', 'pineapple', 'asparagus']);
    expect(el('fruits').style.order).toBe('1');
    expect(el('vegetables').style.order).toBe('2');
    expect(el('settings').hidden).toBe(true);

    type('ca');
    expect(visualOrder()).toEqual(['carrot', 'cabbage', 'pineapple']);
    expect(active()).toBe('carrot');
    expect(el('fruits').hidden).toBe(false);

    type('set');
    expect(visualOrder()).toEqual(['settings']);
    expect(el('fruits').hidden).toBe(true);
    expect(el('fruits').style.display).toBe('none');
    expect(el('vegetables').hidden).toBe(true);
  });

  it('shows Empty and selects nothing when no item matches', () => {
    const fixture = setup();
    type('zzz');
    expect(el('empty').textContent).toBe('No results.');
    expect(el('empty').getAttribute('role')).toBe('presentation');
    expect(el('empty').hasAttribute('cmdk-empty')).toBe(true);
    expect(el('fruits').hidden).toBe(true);
    expect(el('vegetables').hidden).toBe(true);
    expect(fixture.bound().value).toBe('');
    expect(input().hasAttribute('aria-activedescendant')).toBe(false);
    expect(el('state').textContent).toBe('zzz||0|');
  });

  it('restores the declared order when the search is cleared', () => {
    setup();
    type('c');
    type('');
    expect(visualOrder()).toEqual(['apple', 'banana', 'pineapple', 'carrot', 'cabbage', 'asparagus', 'settings']);
    expect(el('settings').style.order).toBe('');
    expect(el('fruits').style.order).toBe('');
    expect(el('separator').hidden).toBe(false);
    expect(active()).toBe('apple');
  });

  it('matches keywords', () => {
    setup();
    type('tro');
    expect(visualOrder()).toEqual(['pineapple']);
    type('pref');
    expect(visualOrder()).toEqual(['settings']);
  });

  it('keeps force-mounted items visible without counting them', () => {
    const fixture = setup({ webItem: true });
    type('zzz');
    expect(visualOrder()).toEqual(['web']);
    expect(el('empty').textContent).toBe('No results.');
    expect(fixture.bound().value).toBe('Search the web for "zzz"');
    type('c');
    expect(visualOrder()).toEqual(['settings', 'web', 'carrot', 'cabbage', 'pineapple']);
  });

  it('keeps every item in declared order with shouldFilter false', () => {
    setup({ shouldFilter: false });
    type('zzz');
    expect(visualOrder()).toEqual(['apple', 'banana', 'pineapple', 'carrot', 'cabbage', 'asparagus', 'settings']);
    expect(el('apple').style.order).toBe('');
    expect(query('empty')).toBe(null);
    expect(active()).toBe('apple');
  });

  it('ranks with a custom filter', () => {
    const filter = vi.fn((value: string, search: string) => (value.toLowerCase().startsWith(search) ? 1 : 0));
    setup({ filter });
    type('c');
    expect(visualOrder()).toEqual(['carrot', 'cabbage']);
    expect(filter).toHaveBeenCalledWith('Settings', 'c', ['preferences']);
  });

  it('keeps an always-rendered separator while searching', () => {
    setup({ alwaysRender: true });
    type('c');
    expect(el('separator').hidden).toBe(false);
  });

  it('keeps a bound value that names a match when the search is set at mount', () => {
    const onValueChange = vi.fn();
    const fixture = setup({ value: 'Asparagus', search: 'a', onValueChange });
    expect(active()).toBe('asparagus');
    expect(fixture.bound().value).toBe('Asparagus');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(visualOrder()).toEqual(['apple', 'banana', 'pineapple', 'asparagus', 'carrot', 'cabbage']);
  });

  it('keeps a bound value that names a hidden item at mount, and selects the best match once the search changes', () => {
    const onValueChange = vi.fn();
    const fixture = setup({ value: 'Banana', search: 'ap', onValueChange });
    expect(active()).toBe(undefined);
    expect(fixture.bound().value).toBe('Banana');
    expect(el('banana').hidden).toBe(true);
    type('app');
    expect(active()).toBe('apple');
    expect(onValueChange.mock.calls).toEqual([['Apple']]);
  });

  it('reports the current text of a force-mounted item that shows the search', async () => {
    const onValueChange = vi.fn();
    const fixture = setup({ webItem: true, onValueChange });
    type('z');
    await tick();
    type('zz');
    await tick();
    expect(onValueChange.mock.calls).toEqual([['Apple'], ['Search the web for "z"'], ['Search the web for "zz"']]);
    expect(fixture.bound().value).toBe('Search the web for "zz"');
    expect(active()).toBe('web');
  });

  it('scrolls keyboard and search selections into view, with the group heading for the first item of a group', () => {
    const scrolled = recordScrolls();
    const fixture = setup();
    expect(active()).toBe('apple');
    press('ArrowDown');
    expect(scrolled).toEqual(['banana']);
    press('Home');
    expect(scrolled).toEqual(['banana', 'Fruits', 'apple']);
    type('c');
    expect(active()).toBe('settings');
    expect(scrolled).toEqual(['banana', 'Fruits', 'apple', 'settings']);
    press('ArrowDown');
    expect(scrolled).toEqual(['banana', 'Fruits', 'apple', 'settings', 'Vegetables', 'carrot']);
    type('');
    pointer('banana');
    fixture.setValue('Asparagus');
    flushSync();
    expect(active()).toBe('asparagus');
    click('settings');
    expect(scrolled).toEqual(['banana', 'Fruits', 'apple', 'settings', 'Vegetables', 'carrot', 'Fruits', 'apple']);
  });

  it('does not scroll on mount or when the bound value changes after a keyboard move', () => {
    const scrolled = recordScrolls();
    const fixture = setup();
    expect(scrolled).toEqual([]);
    press('ArrowDown');
    fixture.setValue('Carrot');
    flushSync();
    expect(active()).toBe('carrot');
    expect(scrolled).toEqual(['banana']);
  });

  it('sets --cmdk-list-height from the sizer height', () => {
    let resize: () => void = () => {};
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
        disconnect() {}
      }
    );
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    setup();
    const sizer = el('list').querySelector<HTMLElement>('[cmdk-list-sizer]')!;
    Object.defineProperty(sizer, 'offsetHeight', { value: 212 });
    resize();
    expect(el('list').style.getPropertyValue('--cmdk-list-height')).toBe('212.0px');
  });

  it('reads the state from a descendant', () => {
    setup();
    expect(el('state').textContent).toBe(`|Apple|7|${el('apple').id}`);
  });
});

describe('Command with duplicate values', () => {
  it('walks every item with the arrow keys', () => {
    setupDuplicates();
    expect(keyboardOrder()).toEqual(['apple1', 'pear', 'apple2', 'plum']);
  });

  it('selects the duplicate under the pointer without reporting a change', () => {
    const onValueChange = vi.fn();
    const fixture = setupDuplicates({ onValueChange });
    pointer('apple2');
    expect(active()).toBe('apple2');
    expect(selected()).toEqual(['apple2']);
    press('ArrowDown');
    expect(active()).toBe('plum');
    press('ArrowUp');
    expect(active()).toBe('apple2');
    expect(fixture.bound().value).toBe('Apple');
    expect(onValueChange.mock.calls).toEqual([['Apple'], ['Plum'], ['Apple']]);
  });

  it('maps a bound value write to the first item with that value', () => {
    const fixture = setupDuplicates();
    pointer('apple2');
    fixture.setValue('Pear');
    flushSync();
    expect(active()).toBe('pear');
    fixture.setValue('Apple');
    flushSync();
    expect(active()).toBe('apple1');
  });
});

describe('Command with changing items', () => {
  it('selects the first item when the selected one unmounts', () => {
    const fixture = setupDynamic();
    press('ArrowDown');
    expect(active()).toBe('two');
    fixture.setItems(['one', 'three']);
    flushSync();
    expect(active()).toBe('one');
    expect(fixture.bound().value).toBe('one');
  });

  it('keeps a preset value that names no item until an item with that value mounts', () => {
    const onValueChange = vi.fn();
    const fixture = setupDynamic({ value: 'four', onValueChange });
    expect(fixture.bound().value).toBe('four');
    expect(active()).toBe(undefined);
    fixture.setItems(['one', 'two', 'three', 'four']);
    flushSync();
    expect(active()).toBe('four');
    press('ArrowUp');
    expect(onValueChange.mock.calls).toEqual([['three']]);
  });

  it('forgets an item whose boundary failed, and keyboard order follows later reorders', async () => {
    const fixture = setupDynamic();
    fixture.setBroken(true);
    flushSync();
    await tick();
    expect(el('failed').textContent).toBe('failed');
    expect(query('ghost')).toBe(null);
    expect(keyboardOrder()).toEqual(['one', 'two', 'three', 'text']);
    press('End');
    expect(input().getAttribute('aria-activedescendant')).toBe(el('text').id);
    fixture.setItems(['three', 'one', 'two']);
    flushSync();
    await tick();
    expect(keyboardOrder()).toEqual(['three', 'one', 'two', 'text']);
  });

  it('ranks each new item a bounded number of times when many mount while searching', async () => {
    const searched: string[] = [];
    const filter = (value: string, search: string) => {
      searched.push(value);
      return value.includes(search) ? 1 : 0;
    };
    const fixture = setupDynamic({ filter });
    type('item');
    searched.length = 0;
    const items = Array.from({ length: 300 }, (_, index) => `item ${index}`);
    fixture.setItems(items);
    flushSync();
    await tick();
    const ranked = searched.filter((value) => value.startsWith('item '));
    expect(new Set(ranked).size).toBe(300);
    expect(ranked.length).toBeLessThan(3 * 300);
    expect(active()).toBe('item 0');
    expect(el('item 299').hidden).toBe(false);
    expect(el('text').hidden).toBe(true);
  });

  it('keeps the selection when items mount', () => {
    const fixture = setupDynamic();
    press('ArrowDown');
    fixture.setItems(['zero', 'one', 'two', 'three']);
    flushSync();
    expect(active()).toBe('two');
  });

  it('filters items that mount while searching', () => {
    const fixture = setupDynamic();
    type('fo');
    expect(el('empty').textContent).toBe('Nothing');
    fixture.setItems(['one', 'four']);
    flushSync();
    expect(el('four').hidden).toBe(false);
    expect(el('one').hidden).toBe(true);
    expect(query('empty')).toBe(null);
    expect(active()).toBe('four');
  });

  it('follows keyed reorders in keyboard order', async () => {
    const fixture = setupDynamic({ shouldFilter: false });
    fixture.setItems(['three', 'one', 'two']);
    flushSync();
    await tick();
    expect(keyboardOrder()).toEqual(['three', 'one', 'two', 'text']);
  });

  it('infers the value from text that changes after mount', async () => {
    const fixture = setupDynamic();
    expect(el('text').dataset.value).toBe('Draft');
    fixture.setText('Published');
    flushSync();
    await tick();
    expect(el('text').dataset.value).toBe('Published');
    type('pub');
    expect(el('text').hidden).toBe(false);
    expect(el('one').hidden).toBe(true);
    expect(active()).toBe('text');
  });
});
