import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, tick, unmount } from 'svelte';
import ScrollAreaFixture from './ScrollAreaFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

async function setup() {
  instance = mount(ScrollAreaFixture, { target: document.body });
  flushSync();
  await tick();
  return document.querySelector<HTMLElement>('[data-slot=scroll-area]')!;
}

it('renders the root and a viewport that holds the content', async () => {
  const root = await setup();
  expect(root.id).toBe('area');
  expect(root.className).toBe('cn-scroll-area relative h-72 w-48 rounded-md border');
  const viewport = root.querySelector<HTMLElement>('[data-slot=scroll-area-viewport]')!;
  expect(viewport.parentElement).toBe(root);
  expect(viewport.className).toBe('cn-scroll-area-viewport size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 base-ui-disable-scrollbar');
  expect(viewport.querySelector('h4')!.textContent).toBe('Tags');
  expect(viewport.getAttribute('role')).toBe('presentation');
});

it('the horizontal ScrollBar carries its orientation, classes and a thumb', async () => {
  const root = await setup();
  const bar = root.querySelector<HTMLElement>('[data-slot=scroll-area-scrollbar][data-orientation=horizontal]')!;
  expect(bar.className).toBe('cn-scroll-area-scrollbar flex touch-none p-px transition-colors select-none extra-bar');
  expect(bar.getAttribute('aria-hidden')).toBe('true');
  const thumb = bar.querySelector<HTMLElement>('[data-slot=scroll-area-thumb]')!;
  expect(thumb.className).toBe('cn-scroll-area-thumb relative flex-1 bg-border');
  expect(thumb.getAttribute('data-orientation')).toBe('horizontal');
});

it('ScrollBar is vertical by default', async () => {
  const root = await setup();
  const bar = root.querySelector<HTMLElement>('.vertical-bar')!;
  expect(bar.dataset.slot).toBe('scroll-area-scrollbar');
  expect(bar.dataset.orientation).toBe('vertical');
  expect(bar.querySelector('[data-slot=scroll-area-thumb]')!.getAttribute('data-orientation')).toBe('vertical');
});

it('leaves the built-in vertical scrollbar unmounted while nothing overflows', async () => {
  const root = await setup();
  const bars = [...root.querySelectorAll('[data-slot=scroll-area-scrollbar]')].map(bar => bar.className.includes('vertical-bar') || bar.className.includes('extra-bar'));
  expect(bars).toEqual([true, true]);
});
