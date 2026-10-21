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
  const input = (box: HTMLElement) => box.querySelector<HTMLInputElement>('input[type=checkbox]')!;
  return { form, boxes, input, fixture: instance as unknown as { read(): boolean; write(next: boolean): void } };
}

it('renders a box with the slot, upstream classes, an indicator icon and a real checkbox input', async () => {
  const { boxes, input } = await setup();
  const [terms] = boxes();
  expect(terms.tagName).toBe('SPAN');
  expect(terms.className).toContain('cn-checkbox peer relative shrink-0 outline-none');
  expect(terms.classList.contains('extra')).toBe(true);
  expect(terms.hasAttribute('data-checked')).toBe(true);
  expect(input(terms).checked).toBe(true);
  expect(input(terms).id).toBe('terms');
  const indicator = terms.querySelector('[data-slot=checkbox-indicator]')!;
  expect(indicator.className).toBe('cn-checkbox-indicator grid place-content-center text-current transition-none');
  expect(indicator.querySelector('svg')).not.toBeNull();
});

it('the indicator is absent while unchecked and appears when ticked', async () => {
  const { boxes, input } = await setup();
  const bound = boxes()[1];
  expect(input(bound).checked).toBe(false);
  expect(bound.hasAttribute('data-unchecked')).toBe(true);
  expect(bound.querySelector('[data-slot=checkbox-indicator]')).toBeNull();
  input(bound).click();
  await tick();
  expect(bound.hasAttribute('data-checked')).toBe(true);
  expect(bound.querySelector('[data-slot=checkbox-indicator]')).not.toBeNull();
});

it('bind:checked flows both ways', async () => {
  const { boxes, input, fixture } = await setup();
  input(boxes()[1]).click();
  await tick();
  expect(fixture.read()).toBe(true);
  fixture.write(false);
  flushSync();
  await tick();
  expect(input(boxes()[1]).checked).toBe(false);
  expect(boxes()[1].hasAttribute('data-unchecked')).toBe(true);
});

it('a click on the associated label ticks the checkbox', async () => {
  const { form, boxes, input } = await setup();
  form.querySelector<HTMLLabelElement>('label[for=terms]')!.click();
  await tick();
  expect(input(boxes()[0]).checked).toBe(false);
  expect(boxes()[0].hasAttribute('data-unchecked')).toBe(true);
});

it('a disabled checkbox ignores clicks and is marked disabled', async () => {
  const { boxes, input } = await setup();
  const off = boxes()[2];
  expect(input(off).disabled).toBe(true);
  expect(off.hasAttribute('data-disabled')).toBe(true);
  input(off).click();
  await tick();
  expect(input(off).checked).toBe(true);
});

it('submits ticked values with the form and skips unticked and disabled ones', async () => {
  const { form, boxes, input } = await setup();
  expect([...new FormData(form)]).toEqual([['terms', 'on']]);
  input(boxes()[1]).click();
  await tick();
  expect([...new FormData(form)]).toEqual([['terms', 'on'], ['bound', 'yes']]);
});

it('form reset restores each checkbox to its default', async () => {
  const { form, boxes, input, fixture } = await setup();
  input(boxes()[0]).click();
  input(boxes()[1]).click();
  await tick();
  expect([...new FormData(form)]).toEqual([['bound', 'yes']]);
  form.reset();
  await new Promise(resolve => setTimeout(resolve));
  flushSync();
  expect(boxes()[0].hasAttribute('data-checked')).toBe(true);
  expect(boxes()[1].hasAttribute('data-unchecked')).toBe(true);
  expect(fixture.read()).toBe(false);
  expect([...new FormData(form)]).toEqual([['terms', 'on']]);
});
