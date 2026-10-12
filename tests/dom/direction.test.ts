import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, tick, unmount } from 'svelte';
import DirectionFixture from './DirectionFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

const text = (id: string) => document.querySelector(`[data-testid=${id}]`)!.textContent;

it('descendants read the provider direction and outside readers fall back to ltr', async () => {
  instance = mount(DirectionFixture, { target: document.body });
  await tick();
  expect(text('reader')).toBe('rtl');
  expect(text('outer')).toBe('ltr');
});

it('a changed direction prop reaches descendants', async () => {
  instance = mount(DirectionFixture, { target: document.body });
  await tick();
  (instance as unknown as { set(next: 'ltr' | 'rtl'): void }).set('ltr');
  flushSync();
  expect(text('reader')).toBe('ltr');
});
