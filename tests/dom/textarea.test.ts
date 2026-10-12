import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import TextareaForm from './TextareaForm.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  instance = mount(TextareaForm, { target: document.body });
  flushSync();
  const form = document.querySelector('form')!;
  const field = (name: string) => form.querySelector<HTMLTextAreaElement>(`[name=${name}]`)!;
  return { form, field, fixture: instance as unknown as { read(): string; write(next: string): void } };
}

it('renders a styled native textarea', () => {
  const { field } = setup();
  expect(field('bound').dataset.slot).toBe('textarea');
  expect(field('bound').classList.contains('cn-textarea')).toBe(true);
});

it('bind:value flows both ways', () => {
  const { field, fixture } = setup();
  expect(field('bound').value).toBe('Initial');
  field('bound').value = 'Typed';
  field('bound').dispatchEvent(new Event('input', { bubbles: true }));
  expect(fixture.read()).toBe('Typed');
  fixture.write('Set');
  flushSync();
  expect(field('bound').value).toBe('Set');
});

it('submits enabled values and resets to defaults like a native form', () => {
  const { form, field } = setup();
  field('draft').value = 'Edited';
  expect([...new FormData(form)]).toEqual([['bound', 'Initial'], ['draft', 'Edited']]);
  form.reset();
  expect(field('draft').value).toBe('Draft');
});
