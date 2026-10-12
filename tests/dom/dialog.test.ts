import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import DialogFixture from './DialogFixture.svelte';

type Fixture = { isOpen(): boolean; setOpen(next: boolean): void; remove(): void };
const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => {
  for (const instance of mounted.splice(0)) await unmount(instance);
  document.body.replaceChildren();
  document.documentElement.removeAttribute('style');
});

async function settle() {
  await tick();
  await new Promise(resolve => setTimeout(resolve, 70));
  await tick();
}

async function setup(props: { contentClose?: boolean; footerClose?: boolean; cancel?: boolean } = {}) {
  const events: string[] = [];
  const instance = mount(DialogFixture, { target: document.body, props: { ...props, events } });
  mounted.push(instance);
  await settle();
  const button = (name: string) => [...document.querySelectorAll<HTMLButtonElement>('button')].find(node => node.textContent?.trim() === name)!;
  const popup = () => document.querySelector<HTMLElement>('[role=dialog]');
  return { fixture: instance as unknown as Fixture, events, button, popup };
}

it('the trigger opens a labelled, portalled dialog with an overlay', async () => {
  const { button, popup, fixture } = await setup();
  const trigger = button('Open');
  expect(trigger.dataset.slot).toBe('dialog-trigger');
  expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  expect(popup()).toBeNull();
  trigger.click();
  await settle();
  const dialog = popup()!;
  expect(fixture.isOpen()).toBe(true);
  expect(dialog.dataset.slot).toBe('dialog-content');
  expect(dialog.classList.contains('cn-dialog-content')).toBe(true);
  expect(dialog.classList.contains('p-8')).toBe(true);
  expect(dialog.closest('[data-slot=dialog-portal]')!.parentElement).toBe(document.body);
  expect(document.querySelector('[data-slot=dialog-overlay]')!.classList.contains('cn-dialog-overlay')).toBe(true);
  expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)!.textContent).toBe('Title');
  expect(document.getElementById(dialog.getAttribute('aria-describedby')!)!.textContent).toBe('Description');
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
});

it('the built-in close button is a ghost icon Button with a screen reader label', async () => {
  const { button, popup } = await setup();
  button('Open').click();
  await settle();
  const close = popup()!.querySelector<HTMLButtonElement>('.cn-dialog-close')!;
  expect(close.localName).toBe('button');
  expect(close.type).toBe('button');
  expect(close.dataset.slot).toBe('dialog-close');
  expect([...close.classList].filter(name => name.startsWith('cn-button'))).toEqual(['cn-button', 'cn-button-variant-ghost', 'cn-button-size-icon-sm']);
  expect(close.querySelector('.sr-only')!.textContent).toBe('Close');
  close.click();
  await settle();
  expect(popup()).toBeNull();
});

it('the footer close option renders an outline Button and the content close can be omitted', async () => {
  const { button, popup } = await setup({ contentClose: false, footerClose: true });
  button('Open').click();
  await settle();
  const dialog = popup()!;
  expect(dialog.querySelector('.cn-dialog-close')).toBeNull();
  const footerClose = [...dialog.querySelectorAll<HTMLButtonElement>('[data-slot=dialog-footer] button')].map(node => [node.textContent?.trim(), node.classList.contains('cn-button-variant-outline')]);
  expect(footerClose).toEqual([['Dismiss', false], ['Close', true]]);
});

it('bind:open opens and closes the dialog from the owner', async () => {
  const { fixture, popup } = await setup();
  fixture.setOpen(true);
  await settle();
  expect(popup()).not.toBeNull();
  fixture.setOpen(false);
  await settle();
  expect(popup()).toBeNull();
});

it('onOpenChange reports the reason and can cancel a close', async () => {
  const { button, popup, events } = await setup({ cancel: false });
  button('Open').click();
  await settle();
  button('Dismiss').click();
  await settle();
  expect(events.filter(event => event.startsWith('change'))).toEqual(['change:true:trigger-press', 'change:false:close-press']);
  expect(popup()).toBeNull();
});

it('a canceled change keeps the dialog in its current state', async () => {
  const { button, popup, fixture } = await setup({ cancel: true });
  button('Open').click();
  await settle();
  expect(popup()).toBeNull();
  expect(fixture.isOpen()).toBe(false);
});

it('attachments reach the popup and clean up, and unmounting releases the scroll lock', async () => {
  const { button, events, fixture } = await setup();
  button('Open').click();
  await settle();
  expect(events).toContain('attach:dialog-content');
  fixture.remove();
  await settle();
  expect(events.at(-1)).toBe('detach:dialog-content');
  expect(document.querySelector('[data-slot=dialog-portal]')).toBeNull();
  expect(document.documentElement.style.overflow).toBe('');
});
