import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import PopoverFixture from './PopoverFixture.svelte';

type Fixture = { isOpen(): boolean; setOpen(next: boolean): void };
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => {
  for (const instance of mounted.splice(0)) await unmount(instance);
  document.body.replaceChildren();
});

async function settle() {
  await tick();
  await new Promise(resolve => setTimeout(resolve, 70));
  await tick();
}

async function setup(props: { side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end'; align?: 'start' | 'center' | 'end' } = {}) {
  const events: string[] = [];
  const instance = mount(PopoverFixture, { target: document.body, props: { ...props, events } });
  mounted.push(instance);
  await settle();
  const trigger = () => document.querySelector<HTMLButtonElement>('[data-slot=popover-trigger]')!;
  const popup = () => document.querySelector<HTMLElement>('[data-slot=popover-content]');
  return { fixture: instance as unknown as Fixture, events, trigger, popup };
}

it('the trigger opens a labelled popover inside a positioner', async () => {
  const { trigger, popup, fixture } = await setup();
  expect(trigger().textContent).toBe('Open');
  expect(trigger().getAttribute('aria-expanded')).toBe('false');
  expect(popup()).toBeNull();
  trigger().click();
  await settle();
  const content = popup()!;
  expect(fixture.isOpen()).toBe(true);
  expect(trigger().getAttribute('aria-expanded')).toBe('true');
  expect(content.getAttribute('role')).toBe('dialog');
  expect(content.classList.contains('cn-popover-content')).toBe(true);
  expect(content.classList.contains('cn-popover-content-logical')).toBe(true);
  expect(content.classList.contains('w-40')).toBe(true);
  expect(content.classList.contains('w-72')).toBe(false);
  const positioner = content.parentElement!;
  expect(positioner.className).toBe('isolate z-50');
  expect(positioner.parentElement!.hasAttribute('data-base-ui-portal')).toBe(true);
  expect(positioner.parentElement!.parentElement).toBe(document.body);
  expect(positioner.style.getPropertyValue('--transform-origin')).not.toBe('');
  expect(document.getElementById(content.getAttribute('aria-labelledby')!)!.textContent).toBe('Dimensions');
  expect(document.getElementById(content.getAttribute('aria-describedby')!)!.textContent).toBe('Set the dimensions for the layer.');
});

it('the header, title and description carry their slots and classes', async () => {
  const { trigger, popup } = await setup();
  trigger().click();
  await settle();
  const header = popup()!.querySelector<HTMLElement>('[data-slot=popover-header]')!;
  expect(header.className).toBe('cn-popover-header extra-header');
  expect(header.querySelector('[data-slot=popover-title]')!.className).toBe('cn-popover-title');
  expect(header.querySelector('[data-slot=popover-description]')!.className).toBe('cn-popover-description');
});

it('defaults to bottom center and forwards side and align to the popup attributes', async () => {
  const first = await setup();
  first.trigger().click();
  await settle();
  expect(first.popup()!.dataset.side).toBe('bottom');
  expect(first.popup()!.dataset.align).toBe('center');
  expect(first.popup()!.hasAttribute('data-open')).toBe(true);
  await unmount(mounted.pop()!);
  document.body.replaceChildren();

  const second = await setup({ side: 'top', align: 'end' });
  second.trigger().click();
  await settle();
  expect(second.popup()!.dataset.side).toBe('top');
  expect(second.popup()!.dataset.align).toBe('end');
});

it('bind:open opens and closes the popover from the owner', async () => {
  const { fixture, popup } = await setup();
  fixture.setOpen(true);
  await settle();
  expect(popup()).not.toBeNull();
  fixture.setOpen(false);
  await settle();
  expect(popup()).toBeNull();
});

it('Escape closes the popover and writes the closed state back through bind:open', async () => {
  const { fixture, popup, trigger, events } = await setup();
  trigger().click();
  await settle();
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await settle();
  expect(popup()).toBeNull();
  expect(fixture.isOpen()).toBe(false);
  expect(events).toEqual(['change:true:trigger-press', 'change:false:escape-key']);
});

it('pressing outside closes the popover', async () => {
  const { fixture, popup, trigger } = await setup();
  trigger().click();
  await settle();
  document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  await settle();
  expect(popup()).toBeNull();
  expect(fixture.isOpen()).toBe(false);
});
