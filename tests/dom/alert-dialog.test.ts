import { afterEach, expect, it } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import AlertDialogFixture from './AlertDialogFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); document.documentElement.removeAttribute('style'); });

async function settle() {
  await tick();
  await new Promise(resolve => setTimeout(resolve, 70));
  await tick();
}

async function setup() {
  const events: string[] = [];
  instance = mount(AlertDialogFixture, { target: document.body, props: { events } });
  await settle();
  const button = (name: string) => [...document.querySelectorAll<HTMLButtonElement>('button')].find(node => node.textContent?.trim() === name)!;
  const popup = () => document.querySelector<HTMLElement>('[role=alertdialog]');
  return { events, button, popup, fixture: instance as unknown as { isOpen(): boolean } };
}

it('the trigger opens a labelled, described alert dialog with the requested size', async () => {
  const { button, popup } = await setup();
  const trigger = button('Delete');
  expect(trigger.dataset.slot).toBe('alert-dialog-trigger');
  expect(popup()).toBeNull();
  trigger.click();
  await settle();
  const dialog = popup()!;
  expect(dialog.dataset.slot).toBe('alert-dialog-content');
  expect(dialog.dataset.size).toBe('sm');
  expect(dialog.closest('[data-slot=alert-dialog-portal]')!.parentElement).toBe(document.body);
  expect(document.querySelector('[data-slot=alert-dialog-overlay]')!.className).toContain('cn-alert-dialog-overlay');
  expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)!.textContent).toBe('Delete the project?');
  expect(document.getElementById(dialog.getAttribute('aria-describedby')!)!.textContent).toBe('This cannot be undone.');
  expect(dialog.querySelector('[data-slot=alert-dialog-media]')!.textContent).toBe('!');
});

it('cancel is an outline button that closes the dialog', async () => {
  const { button, popup, events, fixture } = await setup();
  button('Delete').click();
  await settle();
  const cancel = popup()!.querySelector<HTMLButtonElement>('[data-slot=alert-dialog-cancel]')!;
  expect([...cancel.classList].filter(name => name.startsWith('cn-'))).toEqual(['cn-button', 'cn-button-variant-outline', 'cn-button-size-default', 'cn-alert-dialog-cancel']);
  cancel.click();
  await settle();
  expect(fixture.isOpen()).toBe(false);
  expect(events).toEqual(['change:true:trigger-press', 'change:false:close-press']);
});

it('action is a Button that keeps the dialog open until the app closes it', async () => {
  const { button, popup, events, fixture } = await setup();
  button('Delete').click();
  await settle();
  const action = popup()!.querySelector<HTMLButtonElement>('[data-slot=alert-dialog-action]')!;
  expect([...action.classList].filter(name => name.startsWith('cn-'))).toEqual(['cn-button', 'cn-button-variant-destructive', 'cn-button-size-default', 'cn-alert-dialog-action']);
  action.click();
  await settle();
  expect(events).toEqual(['change:true:trigger-press', 'action']);
  expect(fixture.isOpen()).toBe(true);
});
