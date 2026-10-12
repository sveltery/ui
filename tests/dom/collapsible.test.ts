import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, tick, unmount } from 'svelte';
import CollapsibleFixture from './CollapsibleFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

async function setup() {
  instance = mount(CollapsibleFixture, { target: document.body });
  await tick();
  return {
    fixture: instance as unknown as { isOpen(): boolean; setOpen(next: boolean): void },
    trigger: () => document.querySelector<HTMLButtonElement>('[data-slot=collapsible-trigger]')!,
    panel: () => document.querySelector<HTMLElement>('[data-slot=collapsible-content]'),
  };
}

it('puts the slots on the parts and merges the consumer classes', async () => {
  const { trigger } = await setup();
  expect(document.querySelector('[data-slot=collapsible]')!.classList.contains('root')).toBe(true);
  expect(trigger().textContent).toBe('Toggle');
  expect(trigger().getAttribute('aria-expanded')).toBe('false');
});

it('clicking the trigger shows and hides the panel and updates bind:open', async () => {
  const { trigger, panel, fixture } = await setup();
  expect(panel()).toBeNull();
  trigger().click();
  await tick();
  expect(fixture.isOpen()).toBe(true);
  expect(panel()!.textContent).toBe('Hidden text');
  expect(panel()!.classList.contains('panel')).toBe(true);
  expect(trigger().hasAttribute('data-panel-open')).toBe(true);
  expect(trigger().getAttribute('aria-controls')).toBe(panel()!.id);
  trigger().click();
  await tick();
  expect(fixture.isOpen()).toBe(false);
  expect(trigger().getAttribute('aria-expanded')).toBe('false');
});

it('bind:open opens the panel from the owner', async () => {
  const { trigger, panel, fixture } = await setup();
  fixture.setOpen(true);
  flushSync();
  await tick();
  expect(panel()).not.toBeNull();
  expect(trigger().getAttribute('aria-expanded')).toBe('true');
});
