import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import InputForm from './InputForm.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  instance = mount(InputForm, { target: document.body });
  flushSync();
  const form = document.querySelector('form')!;
  const field = (name: string) => form.querySelector<HTMLInputElement>(`[name=${name}]`)!;
  const type = (node: HTMLInputElement, next: string) => { node.value = next; node.dispatchEvent(new Event('input', { bubbles: true })); flushSync(); };
  return { form, field, type, fixture: instance as unknown as { read(): string; write(next: string): void } };
}

it('renders a styled native input with the upstream slot and classes', () => {
  const { field } = setup();
  const input = field('bound');
  expect(input.localName).toBe('input');
  expect(input.dataset.slot).toBe('input');
  expect(input.className).toBe('cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50');
});

it('passes attachments and native attributes to the input', () => {
  const { field } = setup();
  expect(field('bound').dataset.attached).toBe('true');
  expect(field('bound').type).toBe('email');
  expect(field('bound').placeholder).toBe('you@example.com');
});

it('bind:value flows both ways', () => {
  const { field, type, fixture } = setup();
  expect(field('bound').value).toBe('Initial');
  type(field('bound'), 'Typed');
  expect(fixture.read()).toBe('Typed');
  fixture.write('Set');
  flushSync();
  expect(field('bound').value).toBe('Set');
});

it('submits enabled values and skips disabled ones', () => {
  const { form, field, type } = setup();
  type(field('draft'), 'Edited');
  type(field('bound'), 'me@example.com');
  expect([...new FormData(form)]).toEqual([['bound', 'me@example.com'], ['draft', 'Edited']]);
});

it('native form reset restores the defaultValue', async () => {
  const { form, field, type } = setup();
  expect(field('draft').value).toBe('Draft');
  type(field('draft'), 'Edited');
  expect(field('draft').value).toBe('Edited');
  form.reset();
  await new Promise(resolve => setTimeout(resolve));
  flushSync();
  expect(field('draft').value).toBe('Draft');
});
