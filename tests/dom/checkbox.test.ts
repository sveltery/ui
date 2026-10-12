import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, tick, unmount } from 'svelte';
import CheckboxForm from './CheckboxForm.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

async function setup() {
  instance = mount(CheckboxForm, { target: document.body });
  await tick();
  const form = document.querySelector('form')!;
  const boxes = () => [...form.querySelectorAll<HTMLElement>('[data-slot=checkbox]')];
  return { form, boxes, fixture: instance as unknown as { read(): boolean; write(next: boolean): void } };
}

it('renders a checkbox with the slot, upstream classes and an indicator icon', async () => {
  const { boxes } = await setup();
  const [terms] = boxes();
  expect(terms.getAttribute('role')).toBe('checkbox');
  expect(terms.className).toContain('cn-checkbox peer relative shrink-0 outline-none');
  expect(terms.classList.contains('extra')).toBe(true);
  expect(terms.hasAttribute('data-checked')).toBe(true);
  expect(terms.getAttribute('aria-checked')).toBe('true');
  const indicator = terms.querySelector('[data-slot=checkbox-indicator]')!;
  expect(indicator.className).toBe('cn-checkbox-indicator grid place-content-center text-current transition-none');
  expect(indicator.querySelector('svg')).not.toBeNull();
});

it('the indicator is absent while unchecked and appears when ticked', async () => {
  const { boxes } = await setup();
  const bound = boxes()[1];
  expect(bound.getAttribute('aria-checked')).toBe('false');
  expect(bound.hasAttribute('data-unchecked')).toBe(true);
  expect(bound.querySelector('[data-slot=checkbox-indicator]')).toBeNull();
  bound.click();
  await tick();
  expect(bound.getAttribute('aria-checked')).toBe('true');
  expect(bound.querySelector('[data-slot=checkbox-indicator]')).not.toBeNull();
});

it('bind:checked flows both ways', async () => {
  const { boxes, fixture } = await setup();
  boxes()[1].click();
  await tick();
  expect(fixture.read()).toBe(true);
  fixture.write(false);
  flushSync();
  await tick();
  expect(boxes()[1].getAttribute('aria-checked')).toBe('false');
});

it('a click on the associated label ticks the checkbox', async () => {
  const { form, boxes } = await setup();
  form.querySelector<HTMLLabelElement>('label[for=terms]')!.click();
  await tick();
  expect(boxes()[0].getAttribute('aria-checked')).toBe('false');
});

it('a disabled checkbox ignores clicks and is marked aria-disabled', async () => {
  const { boxes } = await setup();
  const off = boxes()[2];
  expect(off.getAttribute('aria-disabled')).toBe('true');
  expect(off.getAttribute('aria-checked')).toBe('true');
  off.click();
  await tick();
  expect(off.getAttribute('aria-checked')).toBe('true');
});

it('submits ticked values with the form and skips unticked and disabled ones', async () => {
  const { form, boxes } = await setup();
  expect([...new FormData(form)]).toEqual([['terms', 'on']]);
  boxes()[1].click();
  await tick();
  expect([...new FormData(form)]).toEqual([['terms', 'on'], ['bound', 'yes']]);
});

it('form reset restores each checkbox to its default', async () => {
  const { form, boxes, fixture } = await setup();
  boxes()[0].click();
  boxes()[1].click();
  await tick();
  expect([...new FormData(form)]).toEqual([['bound', 'yes']]);
  form.reset();
  await new Promise(resolve => setTimeout(resolve));
  flushSync();
  expect(boxes()[0].getAttribute('aria-checked')).toBe('true');
  expect(boxes()[1].getAttribute('aria-checked')).toBe('false');
  expect(fixture.read()).toBe(false);
  expect([...new FormData(form)]).toEqual([['terms', 'on']]);
});
