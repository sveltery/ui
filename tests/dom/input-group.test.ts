import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import InputGroupFixture from './InputGroupFixture.svelte';

type Fixture = { read(): { value: string; note: string }; write(next: string): void };
let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup() {
  const events: string[] = [];
  instance = mount(InputGroupFixture, { target: document.body, props: { events } });
  flushSync();
  const form = document.querySelector('form')!;
  const field = <T extends HTMLElement>(name: string) => form.querySelector<T>(`[name=${name}]`)!;
  const byText = (text: string) => {
    const nodes = [...form.querySelectorAll<HTMLElement>('button, [data-slot=input-group-addon]')].filter(node => node.textContent?.trim() === text);
    return nodes.find(node => node.localName === 'button') ?? nodes[0]!;
  };
  return { form, field, byText, events, fixture: instance as unknown as Fixture };
}

it('renders the group, addons and controls with their slots and classes', () => {
  const { field, byText } = setup();
  const group = document.querySelector<HTMLElement>('[data-slot=input-group]')!;
  expect(group.getAttribute('role')).toBe('group');
  expect(group.className).toBe('group/input-group cn-input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto');
  const start = byText('URL');
  expect(start.dataset.align).toBe('inline-start');
  expect(start.className).toBe('cn-input-group-addon flex cursor-text items-center justify-center select-none cn-input-group-addon-align-inline-start order-first');
  expect(byText('Footer').dataset.align).toBe('block-end');
  expect(byText('Footer').classList.contains('cn-input-group-addon-align-block-end')).toBe(true);
  expect(document.querySelector('[data-testid=text]')!.className).toBe('cn-input-group-text flex items-center [&_svg]:pointer-events-none');
  expect(field('url').dataset.slot).toBe('input-group-control');
  expect(field('url').classList.contains('cn-input')).toBe(true);
  expect(field('url').classList.contains('cn-input-group-input')).toBe(true);
  expect(field('note').dataset.slot).toBe('input-group-control');
  expect(field('note').classList.contains('cn-textarea')).toBe(true);
  expect(field('note').classList.contains('cn-input-group-textarea')).toBe(true);
});

it('the button defaults to a ghost xs button of type button', () => {
  const { byText } = setup();
  const go = byText('Go') as HTMLButtonElement;
  expect(go.type).toBe('button');
  expect(go.dataset.size).toBe('xs');
  expect(go.classList.contains('cn-button-variant-ghost')).toBe(true);
  expect(go.classList.contains('cn-input-group-button-size-xs')).toBe(true);
  const send = byText('Send') as HTMLButtonElement;
  expect(send.type).toBe('submit');
  expect(send.classList.contains('cn-button-variant-outline')).toBe(true);
  expect(send.classList.contains('cn-input-group-button-size-icon-sm')).toBe(true);
});

it('clicking an addon focuses its group input', () => {
  const { field, byText } = setup();
  byText('URL').click();
  expect(document.activeElement).toBe(field('url'));
});

it('clicking a button inside an addon does not focus the input and still runs its handler', () => {
  const { field, byText, events } = setup();
  byText('Go').click();
  expect(events).toEqual(['button']);
  expect(document.activeElement).not.toBe(field('url'));
});

it('a consumer onclick replaces the focus handler, as upstream', () => {
  const { field, byText, events } = setup();
  byText('Veto').click();
  expect(events).toEqual(['addon']);
  expect(document.activeElement).not.toBe(field('other'));
});

it('bind:value flows through the group input and textarea', () => {
  const { field, fixture } = setup();
  const url = field<HTMLInputElement>('url');
  expect(url.value).toBe('https://');
  url.value = 'https://svelte.dev';
  url.dispatchEvent(new Event('input', { bubbles: true }));
  flushSync();
  expect(fixture.read().value).toBe('https://svelte.dev');
  fixture.write('x');
  flushSync();
  expect(url.value).toBe('x');
  const note = field<HTMLTextAreaElement>('note');
  note.value = 'Edited';
  note.dispatchEvent(new Event('input', { bubbles: true }));
  flushSync();
  expect(fixture.read().note).toBe('Edited');
});

it('submits the control values and skips disabled ones', () => {
  const { form } = setup();
  expect([...new FormData(form)]).toEqual([['url', 'https://'], ['other', 'Other'], ['note', 'Hello']]);
});
