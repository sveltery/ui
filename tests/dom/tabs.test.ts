import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, tick, unmount } from 'svelte';
import TabsFixture from './TabsFixture.svelte';

type Fixture = { read(): string; write(next: string): void };
let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

async function setup(props: { variant?: 'default' | 'line'; orientation?: 'horizontal' | 'vertical'; activateOnFocus?: boolean } = {}) {
  instance = mount(TabsFixture, { target: document.body, props });
  flushSync();
  await tick();
  const tab = (name: string) => [...document.querySelectorAll<HTMLButtonElement>('[role=tab]')].find(node => node.textContent?.trim() === name)!;
  const panels = () => [...document.querySelectorAll<HTMLElement>('[role=tabpanel]')].map(node => node.textContent?.trim());
  const press = (node: HTMLElement, key: string) => { node.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })); flushSync(); };
  return { fixture: instance as unknown as Fixture, tab, panels, press };
}

it('renders slotted, styled parts with the upstream classes', async () => {
  const { tab } = await setup();
  const root = document.querySelector<HTMLElement>('[data-slot=tabs]')!;
  expect(root.className).toBe('cn-tabs group/tabs flex data-horizontal:flex-col extra');
  expect(root.dataset.orientation).toBe('horizontal');
  const list = document.querySelector<HTMLElement>('[data-slot=tabs-list]')!;
  expect(list.getAttribute('role')).toBe('tablist');
  expect(list.dataset.variant).toBe('default');
  expect(list.classList.contains('cn-tabs-list-variant-default')).toBe(true);
  expect(list.classList.contains('bg-muted')).toBe(true);
  expect(tab('Account').dataset.slot).toBe('tabs-trigger');
  expect(tab('Account').classList.contains('cn-tabs-trigger')).toBe(true);
  expect(document.querySelector('[data-slot=tabs-content]')!.classList.contains('cn-tabs-content')).toBe(true);
});

it('the line variant swaps the list classes', async () => {
  await setup({ variant: 'line' });
  const list = document.querySelector<HTMLElement>('[data-slot=tabs-list]')!;
  expect(list.dataset.variant).toBe('line');
  expect(list.classList.contains('cn-tabs-list-variant-line')).toBe(true);
  expect(list.classList.contains('cn-tabs-list-variant-default')).toBe(false);
  expect(list.classList.contains('bg-transparent')).toBe(true);
});

it('bind:value selects the initial tab and follows both directions', async () => {
  const { fixture, tab, panels } = await setup();
  expect(tab('Account').getAttribute('aria-selected')).toBe('true');
  expect(tab('Account').hasAttribute('data-active')).toBe(true);
  expect(panels()).toEqual(['Account panel']);
  tab('Password').click();
  flushSync();
  expect(fixture.read()).toBe('password');
  expect(panels()).toEqual(['Password panel']);
  expect(tab('Account').hasAttribute('data-active')).toBe(false);
  fixture.write('notifications');
  flushSync();
  await tick();
  expect(tab('Notifications').getAttribute('aria-selected')).toBe('true');
  expect(panels()).toEqual(['Notifications panel']);
});

it('arrow keys move focus through the tabs, disabled ones included, and wrap', async () => {
  const { fixture, tab, press } = await setup();
  tab('Account').focus();
  press(tab('Account'), 'ArrowRight');
  expect(document.activeElement).toBe(tab('Password'));
  expect(fixture.read()).toBe('account');
  press(tab('Password'), 'ArrowRight');
  expect(document.activeElement).toBe(tab('Locked'));
  press(tab('Locked'), 'ArrowRight');
  press(tab('Notifications'), 'ArrowRight');
  expect(document.activeElement).toBe(tab('Account'));
  press(tab('Account'), 'End');
  expect(document.activeElement).toBe(tab('Notifications'));
  tab('Notifications').click();
  flushSync();
  expect(fixture.read()).toBe('notifications');
});

it('activateOnFocus selects the tab arrow keys reach', async () => {
  const { fixture, tab, press } = await setup({ activateOnFocus: true });
  tab('Account').focus();
  press(tab('Account'), 'ArrowRight');
  expect(fixture.read()).toBe('password');
});

it('a disabled tab ignores clicks and exposes aria-disabled', async () => {
  const { fixture, tab } = await setup();
  const locked = tab('Locked');
  expect(locked.getAttribute('aria-disabled')).toBe('true');
  expect(locked.hasAttribute('data-disabled')).toBe(true);
  locked.click();
  flushSync();
  expect(fixture.read()).toBe('account');
});

it('vertical orientation reaches the list and tabs as data-orientation', async () => {
  const { tab, press } = await setup({ orientation: 'vertical' });
  expect(document.querySelector('[data-slot=tabs]')!.getAttribute('data-orientation')).toBe('vertical');
  expect(document.querySelector('[data-slot=tabs-list]')!.getAttribute('aria-orientation')).toBe('vertical');
  tab('Account').focus();
  press(tab('Account'), 'ArrowDown');
  expect(document.activeElement).toBe(tab('Password'));
});
