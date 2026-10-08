import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import Owner from './DialogExampleOwner.svelte';

const mounted: ReturnType<typeof mount>[] = [];
beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] }));
async function settle() {
  await tick(); await vi.advanceTimersByTimeAsync(100);
  await tick(); await vi.advanceTimersByTimeAsync(100); await tick();
}
afterEach(async () => {
  for (const instance of mounted.splice(0)) await unmount(instance);
  vi.useRealTimers(); document.body.replaceChildren(); document.documentElement.removeAttribute('style');
});
async function setup(initial = 'custom') {
  const host = document.createElement('div'); document.body.append(host);
  const owner = mount(Owner, { target: host, props: { initial } }); mounted.push(owner); await settle();
  const state = () => JSON.parse(host.querySelector('[data-testid=state]')!.textContent!);
  const trigger = () => host.querySelector<HTMLElement>('[data-testid=trigger]')!;
  const click = async (testId: string) => { host.querySelector<HTMLElement>(`[data-testid=${testId}]`)!.click(); await settle(); };
  return { owner, state, trigger, click };
}

it('scenario changes replace attached hosts without changing owner state or cancellation', async () => {
  const { owner, state, click } = await setup();
  await click('trigger');
  expect(state()).toMatchObject({ open: true, trigger: 'trigger', popup: 'content', attachments: 1, cleanups: 0, completions: [true] });
  owner.setScenario('ordinary'); await settle();
  expect(state()).toMatchObject({ open: true, trigger: true, popup: true, attachments: 1, cleanups: 1, completions: [true, true] });
  owner.setScenario('custom'); await settle();
  expect(state()).toMatchObject({ open: true, trigger: 'trigger', popup: 'content', attachments: 2, cleanups: 1, completions: [true, true, true] });
  await click('cancel-next'); await click('action-close');
  expect(state()).toMatchObject({ open: true, attachments: 2, cleanups: 1, completions: [true, true, true] });
  expect(state().log.map((entry: { open: boolean }) => entry.open)).toEqual([true, false]);
  // Base UI 1.8 keeps preventUnmountOnClose from the canceled close (its synced value only resets when open changes),
  // so the next close leaves the popup mounted. Base 44846f6d inherits this; old Base reset it.
  await click('action-close');
  expect(state()).toMatchObject({ open: false, popup: 'content', attachments: 2, cleanups: 1, completions: [true, true, true] });
  await click('trigger');
  expect(state()).toMatchObject({ open: true, popup: 'content', attachments: 2, cleanups: 1, completions: [true, true, true, true] });
  await click('remove');
  expect(state()).toMatchObject({ open: true, trigger: false, popup: false, title: null, attachments: 2, cleanups: 2 });
  expect(document.querySelector('[data-base-ui-portal]')).toBeNull();
  expect(document.documentElement.style.overflow).toBe('');
});

it('the initial trigger declaration follows scenario changes without reinitializing open state', async () => {
  const { owner, state, trigger, click } = await setup('initial');
  const initialId = trigger().id;
  expect(initialId).toMatch(/^example-trigger-/);
  expect(state()).toMatchObject({ open: true, popup: true, log: [] });
  owner.setScenario('ordinary'); await settle();
  expect(trigger().id).not.toBe(initialId);
  expect(state()).toMatchObject({ open: true, popup: true, log: [] });
  owner.setScenario('initial'); await settle();
  expect(trigger().id).toBe(initialId);
  await click('owner-close');
  expect(state()).toMatchObject({ open: false, popup: false });
  owner.setScenario('ordinary'); await settle();
  owner.setScenario('initial'); await settle();
  expect(trigger().id).toBe(initialId);
  expect(state()).toMatchObject({ open: false, popup: false });
});
