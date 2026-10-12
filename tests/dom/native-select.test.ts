import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import NativeSelectForm from './NativeSelectForm.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  instance = mount(NativeSelectForm, { target: document.body });
  flushSync();
  const form = document.querySelector('form')!;
  const select = (name: string) => form.querySelector<HTMLSelectElement>(`select[name=${name}]`)!;
  const choose = (name: string, value: string) => {
    select(name).value = value;
    select(name).dispatchEvent(new Event('change', { bubbles: true }));
    flushSync();
  };
  return { form, select, choose, fixture: instance as unknown as { readMany(): string[]; read(): string; write(next: string): void; changeCount(): number } };
}

it('wraps a native select with the upstream slots, classes and icon', () => {
  const { select } = setup();
  const wrapper = select('bound').parentElement!;
  expect(wrapper.tagName).toBe('DIV');
  expect(wrapper.getAttribute('data-slot')).toBe('native-select-wrapper');
  expect(wrapper.getAttribute('data-size')).toBe('default');
  expect(wrapper.className).toBe('cn-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50 wrapper-extra');
  expect(select('bound').getAttribute('data-slot')).toBe('native-select');
  expect(select('bound').getAttribute('data-size')).toBe('default');
  expect(select('bound').className).toBe('cn-native-select outline-none disabled:pointer-events-none disabled:cursor-not-allowed');
  const icon = wrapper.querySelector('svg')!;
  expect(icon.getAttribute('data-slot')).toBe('native-select-icon');
  expect(icon.getAttribute('aria-hidden')).toBe('true');
  expect(icon.getAttribute('class')).toContain('cn-native-select-icon pointer-events-none absolute select-none');
});

it('puts the id and native attributes on the select and the class on the wrapper', () => {
  const { select } = setup();
  expect(select('bound').id).toBe('bound');
  expect(select('bound').classList.contains('wrapper-extra')).toBe(false);
  expect(select('many').multiple).toBe(true);
  expect(select('off').disabled).toBe(true);
  expect(select('plain').parentElement!.getAttribute('data-size')).toBe('sm');
});

it('styles options and option groups with the upstream classes', () => {
  const { select } = setup();
  const option = select('plain').querySelector('option')!;
  expect(option.getAttribute('data-slot')).toBe('native-select-option');
  expect(option.className).toBe('bg-[Canvas] text-[CanvasText]');
  const group = select('plain').querySelector('optgroup')!;
  expect(group.getAttribute('data-slot')).toBe('native-select-optgroup');
  expect(group.label).toBe('Fruits');
  expect(group.className).toBe('bg-[Canvas] text-[CanvasText]');
  expect(select('plain').value).toBe('banana');
});

it('bind:value flows both ways', () => {
  const { select, choose, fixture } = setup();
  expect(select('bound').value).toBe('banana');
  choose('bound', 'cherry');
  expect(fixture.read()).toBe('cherry');
  fixture.write('apple');
  flushSync();
  expect(select('bound').value).toBe('apple');
});

it('fires onchange and submits the chosen value', () => {
  const { form, choose, fixture } = setup();
  choose('plain', 'apple');
  expect(fixture.changeCount()).toBe(1);
  expect([...new FormData(form)]).toEqual([['bound', 'banana'], ['plain', 'apple'], ['many', 'a'], ['many', 'c']]);
});

it('resets to the option marked selected in markup, like a native form', () => {
  const { form, select, choose } = setup();
  choose('plain', 'apple');
  expect(select('plain').value).toBe('apple');
  form.reset();
  expect(select('plain').value).toBe('banana');
  expect([...new FormData(form)].filter(([name]) => name === 'plain')).toEqual([['plain', 'banana']]);
});

it('restores a multiple selection on reset', async () => {
  const { form, select, fixture } = setup();
  for (const option of select('many').options) option.selected = option.value === 'b';
  select('many').dispatchEvent(new Event('change', { bubbles: true }));
  expect(fixture.readMany()).toEqual(['b']);
  form.reset();
  await new Promise(resolve => setTimeout(resolve));
  expect([...select('many').selectedOptions].map(option => option.value)).toEqual(['a', 'c']);
  expect(fixture.readMany()).toEqual(['a', 'c']);
});
