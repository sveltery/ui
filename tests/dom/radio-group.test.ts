import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import RadioGroupForm from './RadioGroupForm.svelte';

type Fixture = { read(): string; write(next: string): void };
let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  const events: string[] = [];
  instance = mount(RadioGroupForm, { target: document.body, props: { events } });
  flushSync();
  const form = document.querySelector('form')!;
  const item = (label: string) => form.querySelector<HTMLElement>(`[role=radio][aria-label="${label}"]`)!;
  const submitted = () => Object.fromEntries([...new FormData(form).entries()].map(([key, value]) => [key, String(value)]));
  return { form, item, events, submitted, fixture: instance as unknown as Fixture };
}

function press(node: Element, key: string) {
  node.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  flushSync();
}

it('renders the group and items with the upstream slots and classes', () => {
  const { form, item } = setup();
  const group = form.querySelector<HTMLElement>('[data-slot=radio-group]')!;
  expect(group.getAttribute('role')).toBe('radiogroup');
  expect(group.className).toBe('cn-radio-group w-full grid-cols-2');
  const medium = item('Medium');
  expect(medium.dataset.slot).toBe('radio-group-item');
  expect(medium.className).toBe('cn-radio-group-item group/radio-group-item peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50 extra-item');
});

it('shows the indicator only on the checked item', () => {
  const { item } = setup();
  const indicator = item('Medium').querySelector<HTMLElement>('[data-slot=radio-group-indicator]')!;
  expect(indicator.className).toBe('cn-radio-group-indicator');
  expect(indicator.querySelector('.cn-radio-group-indicator-icon')).not.toBeNull();
  expect(item('Medium').getAttribute('aria-checked')).toBe('true');
  expect(item('Medium').hasAttribute('data-checked')).toBe(true);
  expect(item('Small').getAttribute('aria-checked')).toBe('false');
  expect(item('Small').hasAttribute('data-unchecked')).toBe(true);
  expect(item('Small').querySelector('[data-slot=radio-group-indicator]')).toBeNull();
});

it('clicking an item selects it and writes bind:value back', () => {
  const { item, events, fixture } = setup();
  item('Large').click();
  flushSync();
  expect(fixture.read()).toBe('large');
  expect(item('Large').getAttribute('aria-checked')).toBe('true');
  expect(item('Medium').getAttribute('aria-checked')).toBe('false');
  expect(events).toEqual(['change:large']);
});

it('bind:value changes from the owner move the selection', () => {
  const { item, fixture } = setup();
  fixture.write('small');
  flushSync();
  expect(item('Small').getAttribute('aria-checked')).toBe('true');
  expect(item('Medium').getAttribute('aria-checked')).toBe('false');
});

it('arrow keys move the selection and skip disabled items', () => {
  const { item, fixture } = setup();
  item('Medium').focus();
  press(item('Medium'), 'ArrowDown');
  expect(fixture.read()).toBe('large');
  expect(document.activeElement).toBe(item('Large'));
  press(item('Large'), 'ArrowDown');
  expect(fixture.read()).toBe('small');
  press(item('Small'), 'ArrowUp');
  expect(fixture.read()).toBe('large');
  press(item('Large'), 'ArrowRight');
  expect(fixture.read()).toBe('small');
});

it('submits the checked value of each enabled named group', () => {
  const { item, submitted } = setup();
  expect(submitted()).toEqual({ size: 'medium', plan: 'pro' });
  item('Small').click();
  item('Plus').click();
  flushSync();
  expect(submitted()).toEqual({ size: 'small', plan: 'plus' });
});

it('restores the initial selection when the form resets', async () => {
  const { form, item, fixture, submitted } = setup();
  item('Small').click();
  item('Plus').click();
  flushSync();
  form.reset();
  await new Promise(resolve => setTimeout(resolve));
  flushSync();
  expect(fixture.read()).toBe('medium');
  expect(item('Medium').getAttribute('aria-checked')).toBe('true');
  expect(item('Plus').getAttribute('aria-checked')).toBe('false');
  expect(item('Pro').getAttribute('aria-checked')).toBe('true');
  expect(submitted()).toEqual({ size: 'medium', plan: 'pro' });
});

it('ignores clicks on a disabled item and a disabled group', () => {
  const { item, fixture, submitted } = setup();
  item('X-Large').click();
  item('Locked B').click();
  flushSync();
  expect(fixture.read()).toBe('medium');
  expect(item('X-Large').getAttribute('aria-checked')).toBe('false');
  expect(item('Locked B').getAttribute('aria-checked')).toBe('false');
  expect(item('X-Large').hasAttribute('data-disabled')).toBe(true);
  expect(submitted()).toEqual({ size: 'medium', plan: 'pro' });
});
