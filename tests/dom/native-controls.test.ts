import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import NativeControlsForm from './NativeControlsForm.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  instance = mount(NativeControlsForm, { target: document.body });
  flushSync();
  const form = document.querySelector('form')!;
  const input = (selector: string) => form.querySelector<HTMLInputElement>(selector)!;
  return { form, input, fixture: instance as unknown as { changeCount(): number } };
}

it('renders native inputs in wrappers that carry the Base slots', () => {
  const { input } = setup();
  const box = input('#news');
  expect(box.type).toBe('checkbox');
  expect(box.className).toContain('cn-native-checkbox');
  expect(box.parentElement!.getAttribute('data-slot')).toBe('checkbox');
  expect(box.parentElement!.classList.contains('box-extra')).toBe(true);
  expect(box.nextElementSibling!.getAttribute('data-slot')).toBe('checkbox-indicator');
  const toggle = input('[name=notify]');
  expect(toggle.type).toBe('checkbox');
  expect(toggle.getAttribute('role')).toBe('switch');
  expect(toggle.dataset.size).toBe('sm');
  expect(toggle.parentElement!.getAttribute('data-slot')).toBe('switch');
  expect(toggle.parentElement!.dataset.size).toBe('sm');
  expect(toggle.parentElement!.classList.contains('switch-extra')).toBe(true);
  expect(toggle.nextElementSibling!.getAttribute('data-slot')).toBe('switch-thumb');
  const range = input('[name=volume]');
  expect(range.type).toBe('range');
  expect(range.getAttribute('data-slot')).toBe('slider');
  expect(range.classList.contains('slider-extra')).toBe(true);
});

it('submits the checked boxes, the switch and the slider, and fires onchange', () => {
  const { form, input, fixture } = setup();
  expect([...new FormData(form)]).toEqual([['topics', 'updates'], ['volume', '4']]);
  input('#news').click();
  input('[name=notify]').click();
  flushSync();
  expect(fixture.changeCount()).toBe(1);
  expect([...new FormData(form)]).toEqual([['topics', 'news'], ['topics', 'updates'], ['notify', 'on'], ['volume', '4']]);
});

it('resets to the default state, like a native form', () => {
  const { form, input } = setup();
  input('#news').click();
  input('[name=volume]').value = '9';
  form.reset();
  expect([...new FormData(form)]).toEqual([['topics', 'updates'], ['volume', '4']]);
});
