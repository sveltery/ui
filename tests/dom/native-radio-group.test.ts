import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import NativeRadioForm from './NativeRadioForm.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  instance = mount(NativeRadioForm, { target: document.body });
  flushSync();
  const form = document.querySelector('form')!;
  const radio = (value: string) => form.querySelector<HTMLInputElement>(`input[value=${value}]`)!;
  return { form, radio, fixture: instance as unknown as { changeCount(): number } };
}

it('renders a radiogroup of native radio inputs with the native slots and classes', () => {
  const { form, radio } = setup();
  const group = form.querySelector('[data-slot=native-radio-group]')!;
  expect(group.getAttribute('role')).toBe('radiogroup');
  expect(group.getAttribute('aria-label')).toBe('Plan');
  expect(group.className).toBe('cn-native-radio-group w-full group-extra');
  expect(radio('free').type).toBe('radio');
  expect(radio('free').getAttribute('data-slot')).toBe('native-radio');
  expect(radio('free').className).toBe('cn-native-radio peer relative aspect-square shrink-0 appearance-none border outline-none disabled:cursor-not-allowed disabled:opacity-50 radio-extra');
  expect(radio('free').id).toBe('free');
  expect(radio('team').disabled).toBe(true);
});

it('submits the checked radio and fires onchange', () => {
  const { form, radio, fixture } = setup();
  expect([...new FormData(form)]).toEqual([['plan', 'pro']]);
  radio('free').click();
  flushSync();
  expect(fixture.changeCount()).toBe(1);
  expect(radio('pro').checked).toBe(false);
  expect([...new FormData(form)]).toEqual([['plan', 'free']]);
});

it('resets to the radio marked defaultChecked, like a native form', () => {
  const { form, radio } = setup();
  radio('free').click();
  form.reset();
  expect(radio('pro').checked).toBe(true);
  expect([...new FormData(form)]).toEqual([['plan', 'pro']]);
});
