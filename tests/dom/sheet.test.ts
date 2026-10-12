import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import SheetFixture from './SheetFixture.svelte';

type Fixture = { isOpen(): boolean; setOpen(next: boolean): void };
let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => {
  if (instance) await unmount(instance);
  document.body.replaceChildren();
  document.documentElement.removeAttribute('style');
});

async function settle() {
  await tick();
  await new Promise(resolve => setTimeout(resolve, 70));
  await tick();
}

async function setup(props: { side?: 'top' | 'right' | 'bottom' | 'left'; closeButton?: boolean } = {}) {
  instance = mount(SheetFixture, { target: document.body, props });
  await settle();
  const button = (name: string) => [...document.querySelectorAll<HTMLButtonElement>('button')].find(node => node.textContent?.trim() === name)!;
  const popup = () => document.querySelector<HTMLElement>('[role=dialog]');
  return { fixture: instance as unknown as Fixture, button, popup };
}

it('the trigger opens a labelled, portalled sheet with an overlay', async () => {
  const { button, popup, fixture } = await setup();
  const trigger = button('Open');
  expect(trigger.dataset.slot).toBe('sheet-trigger');
  expect(popup()).toBeNull();
  trigger.click();
  await settle();
  const sheet = popup()!;
  expect(fixture.isOpen()).toBe(true);
  expect(sheet.dataset.slot).toBe('sheet-content');
  expect(sheet.classList.contains('cn-sheet-content')).toBe(true);
  expect(sheet.closest('[data-slot=sheet-portal]')!.parentElement).toBe(document.body);
  expect(document.querySelector('[data-slot=sheet-overlay]')!.classList.contains('cn-sheet-overlay')).toBe(true);
  expect(document.getElementById(sheet.getAttribute('aria-labelledby')!)!.textContent).toBe('Title');
  expect(document.getElementById(sheet.getAttribute('aria-describedby')!)!.textContent).toBe('Description');
  expect(sheet.querySelector('[data-slot=sheet-header]')!.className).toBe('cn-sheet-header flex flex-col');
  expect(sheet.querySelector('[data-slot=sheet-footer]')!.className).toBe('cn-sheet-footer mt-auto flex flex-col');
});

it('side defaults to right and is reflected as data-side', async () => {
  const { button, popup } = await setup();
  button('Open').click();
  await settle();
  expect(popup()!.dataset.side).toBe('right');
});

it('side="left" sets data-side on the content', async () => {
  const { button, popup } = await setup({ side: 'left' });
  button('Open').click();
  await settle();
  expect(popup()!.dataset.side).toBe('left');
});

it('the built-in close button is a ghost icon Button with a screen reader label', async () => {
  const { button, popup } = await setup();
  button('Open').click();
  await settle();
  const close = popup()!.querySelector<HTMLButtonElement>('.cn-sheet-close')!;
  expect(close.dataset.slot).toBe('sheet-close');
  expect([...close.classList].filter(name => name.startsWith('cn-button'))).toEqual(['cn-button', 'cn-button-variant-ghost', 'cn-button-size-icon-sm']);
  expect(close.querySelector('.sr-only')!.textContent).toBe('Close');
  close.click();
  await settle();
  expect(popup()).toBeNull();
});

it('showCloseButton={false} omits the built-in close button but SheetClose still closes', async () => {
  const { button, popup } = await setup({ closeButton: false });
  button('Open').click();
  await settle();
  expect(popup()!.querySelector('.cn-sheet-close')).toBeNull();
  button('Cancel').click();
  await settle();
  expect(popup()).toBeNull();
});

it('bind:open opens and closes the sheet from the owner', async () => {
  const { fixture, popup } = await setup();
  fixture.setOpen(true);
  await settle();
  expect(popup()).not.toBeNull();
  fixture.setOpen(false);
  await settle();
  expect(popup()).toBeNull();
});

it('Escape closes the sheet and updates bind:open', async () => {
  const { button, popup, fixture } = await setup();
  button('Open').click();
  await settle();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await settle();
  expect(popup()).toBeNull();
  expect(fixture.isOpen()).toBe(false);
});
