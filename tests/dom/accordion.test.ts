import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, tick, unmount } from 'svelte';
import AccordionFixture from './AccordionFixture.svelte';

type Fixture = { read(): unknown[]; write(next: string[]): void };
let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

async function setup(props: { multiple?: boolean; initial?: string[] } = {}) {
  instance = mount(AccordionFixture, { target: document.body, props });
  await tick();
  const trigger = (name: string) => [...document.querySelectorAll<HTMLButtonElement>('button')].find(node => node.textContent?.trim() === name)!;
  const panel = (text: string) => [...document.querySelectorAll<HTMLElement>('[data-slot=accordion-content]')].find(node => node.textContent?.includes(text));
  return { fixture: instance as unknown as Fixture, trigger, panel };
}

it('puts the slots and upstream classes on the parts', async () => {
  await setup();
  const root = document.querySelector<HTMLElement>('[data-slot=accordion]')!;
  expect(root.className).toBe('cn-accordion flex w-full flex-col mx-auto');
  expect(root.querySelector('[data-slot=accordion-item]')!.classList.contains('cn-accordion-item')).toBe(true);
  expect(root.querySelector('.item-a')!.dataset.slot).toBe('accordion-item');
  const trigger = root.querySelector<HTMLButtonElement>('.trigger-a')!;
  expect(trigger.dataset.slot).toBe('accordion-trigger');
  expect(trigger.closest('h3')!.className).toBe('flex');
  expect(trigger.querySelectorAll('svg[data-slot=accordion-trigger-icon]').length).toBe(2);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
});

it('a click opens the panel and the panel inner div keeps the upstream classes', async () => {
  const { trigger, panel, fixture } = await setup();
  expect(panel('First content')).toBeUndefined();
  trigger('First').click();
  await tick();
  const content = panel('First content')!;
  expect(content.className).toContain('cn-accordion-content overflow-hidden');
  expect(content.hasAttribute('data-open')).toBe(true);
  expect(content.firstElementChild!.className).toContain('cn-accordion-content-inner h-(--accordion-panel-height)');
  expect(content.firstElementChild!.classList.contains('content-a')).toBe(true);
  expect(trigger('First').getAttribute('aria-expanded')).toBe('true');
  expect(fixture.read()).toEqual(['a']);
});

it('opening another item closes the first unless multiple is set', async () => {
  const { trigger, panel, fixture } = await setup();
  trigger('First').click();
  await tick();
  trigger('Second').click();
  await tick();
  expect(fixture.read()).toEqual(['b']);
  expect(trigger('First').getAttribute('aria-expanded')).toBe('false');
  expect(panel('Second content')).toBeDefined();
});

it('multiple keeps several items open', async () => {
  const { trigger, fixture } = await setup({ multiple: true });
  trigger('First').click();
  await tick();
  trigger('Second').click();
  await tick();
  expect(fixture.read()).toEqual(['a', 'b']);
});

it('bind:value round-trips from the owner', async () => {
  const { fixture, trigger, panel } = await setup({ initial: ['b'] });
  expect(trigger('Second').getAttribute('aria-expanded')).toBe('true');
  fixture.write(['a']);
  flushSync();
  await tick();
  expect(trigger('First').getAttribute('aria-expanded')).toBe('true');
  expect(trigger('Second').getAttribute('aria-expanded')).toBe('false');
  expect(panel('First content')).toBeDefined();
});

it('a disabled item ignores clicks and its trigger is a disabled button', async () => {
  const { trigger, fixture } = await setup();
  const third = trigger('Third');
  expect(third.disabled).toBe(true);
  third.click();
  await tick();
  expect(fixture.read()).toEqual([]);
  expect(third.getAttribute('aria-expanded')).toBe('false');
});
