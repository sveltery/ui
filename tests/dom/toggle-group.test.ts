import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import ToggleGroupFixture from './ToggleGroupFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  instance = mount(ToggleGroupFixture, { target: document.body });
  flushSync();
  const item = (label: string) => document.querySelector<HTMLButtonElement>(`button[aria-label=${label}]`)!;
  const group = (id: string) => document.getElementById(id)!;
  const press = (label: string) => { item(label).click(); flushSync(); };
  return { item, group, press, fixture: instance as unknown as { readSingle(): string[]; writeSingle(next: string[]): void; readMultiple(): string[] } };
}

it('renders the group with its slot, data attributes, gap and classes', () => {
  const { group } = setup();
  const single = group('single');
  expect(single.getAttribute('role')).toBe('group');
  expect(single.dataset.slot).toBe('toggle-group');
  expect(single.dataset.variant).toBe('outline');
  expect(single.dataset.size).toBe('sm');
  expect(single.dataset.spacing).toBe('2');
  expect(single.dataset.orientation).toBe('horizontal');
  expect(single.style.getPropertyValue('--gap')).toBe('2');
  expect(single.className).toBe('cn-toggle-group group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-vertical:flex-col data-vertical:items-stretch');
  const plain = group('plain');
  expect(plain.hasAttribute('data-variant')).toBe(false);
  expect(plain.hasAttribute('data-size')).toBe(false);
});

it('items take variant and size from the group, which win over their own props', () => {
  const { item } = setup();
  const right = item('Right');
  expect(right.dataset.slot).toBe('toggle-group-item');
  expect(right.dataset.variant).toBe('outline');
  expect(right.dataset.size).toBe('sm');
  expect(right.dataset.spacing).toBe('2');
  const classes = [...right.classList];
  expect(classes).toContain('cn-toggle-group-item');
  expect(classes).toContain('cn-toggle-variant-outline');
  expect(classes).toContain('cn-toggle-size-sm');
  expect(classes).not.toContain('cn-toggle-size-lg');
});

it('items use their own variant and size when the group sets none', () => {
  const { item, group } = setup();
  expect(item('Bold').dataset.variant).toBe('outline');
  expect(item('Underline').dataset.variant).toBe('default');
  expect(item('A').dataset.size).toBe('default');
  expect(item('Bold').dataset.spacing).toBe('0');
  expect(group('multiple').classList.contains('extra')).toBe(true);
});

it('single mode presses one item at a time and bind:value follows', () => {
  const { item, press, fixture } = setup();
  expect(item('Center').getAttribute('aria-pressed')).toBe('true');
  press('Left');
  expect(fixture.readSingle()).toEqual(['left']);
  expect(item('Left').getAttribute('aria-pressed')).toBe('true');
  expect(item('Center').getAttribute('aria-pressed')).toBe('false');
  press('Left');
  expect(fixture.readSingle()).toEqual([]);
});

it('multiple mode keeps several items pressed', () => {
  const { item, press, fixture } = setup();
  press('Italic');
  expect(fixture.readMultiple()).toEqual(['bold', 'italic']);
  expect(item('Bold').hasAttribute('data-pressed')).toBe(true);
  expect(item('Italic').hasAttribute('data-pressed')).toBe(true);
});

it('writing the bound variable presses the matching item', () => {
  const { item, fixture } = setup();
  fixture.writeSingle(['right']);
  flushSync();
  expect(item('Right').getAttribute('aria-pressed')).toBe('true');
  expect(item('Center').getAttribute('aria-pressed')).toBe('false');
});

it('a plain value prop sets the initial selection and the group keeps working', () => {
  const { item, press } = setup();
  expect(item('B').getAttribute('aria-pressed')).toBe('true');
  press('A');
  expect(item('A').getAttribute('aria-pressed')).toBe('true');
  expect(item('B').getAttribute('aria-pressed')).toBe('false');
});

it('a disabled item cannot be pressed', () => {
  const { item, press, fixture } = setup();
  press('Underline');
  expect(item('Underline').getAttribute('aria-pressed')).toBe('false');
  expect(fixture.readMultiple()).toEqual(['bold']);
});

it('arrow keys move focus along the orientation', () => {
  const { item } = setup();
  item('Left').focus();
  item('Left').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
  flushSync();
  expect(document.activeElement).toBe(item('Center'));
  item('Bold').focus();
  item('Bold').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
  flushSync();
  expect(document.activeElement).toBe(item('Bold'));
  item('Bold').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
  flushSync();
  expect(document.activeElement).toBe(item('Italic'));
});
