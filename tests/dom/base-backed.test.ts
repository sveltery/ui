import { afterEach, expect, it } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount } from 'svelte';
import AvatarFixture from './AvatarFixture.svelte';
import { Button } from '$ui/button/index.js';
import { Separator } from '$ui/separator/index.js';

const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => {
  for (const instance of mounted.splice(0)) await unmount(instance);
  document.body.replaceChildren();
});
const text = (value: string) => createRawSnippet(() => ({ render: () => `<span>${value}</span>` }));

it('Button renders a native button with variant and size classes', () => {
  let clicks = 0;
  mount(Button, { target: document.body, props: { variant: 'outline', size: 'sm', class: 'px-6', onclick: () => clicks++, children: text('Save') } });
  flushSync();
  const button = document.querySelector('button')!;
  expect(button.type).toBe('button');
  expect(button.dataset.slot).toBe('button');
  expect([...button.classList].filter(name => name.startsWith('cn-button') || name === 'px-6')).toEqual(['cn-button', 'cn-button-variant-outline', 'cn-button-size-sm', 'px-6']);
  button.click();
  expect(clicks).toBe(1);
});

it('a disabled Button ignores clicks', () => {
  let clicks = 0;
  mounted.push(mount(Button, { target: document.body, props: { disabled: true, onclick: () => clicks++, children: text('Save') } }));
  flushSync();
  const button = document.querySelector('button')!;
  expect(button.disabled).toBe(true);
  button.click();
  expect(clicks).toBe(0);
});

it('Button forwards form attributes for native submission', () => {
  const form = document.createElement('form');
  document.body.append(form);
  mounted.push(mount(Button, { target: form, props: { type: 'submit', name: 'intent', value: 'save', children: text('Save') } }));
  flushSync();
  const button = form.querySelector('button')!;
  let submitter: HTMLElement | null = null;
  form.addEventListener('submit', event => { event.preventDefault(); submitter = event.submitter; });
  button.click();
  expect(submitter).toBe(button);
  expect([...new FormData(form, button)]).toEqual([['intent', 'save']]);
});

it('Avatar sizes its root and shows the fallback until an image loads', () => {
  mounted.push(mount(AvatarFixture, { target: document.body }));
  flushSync();
  const avatar = document.querySelector<HTMLElement>('[data-slot=avatar]')!;
  expect(avatar.dataset.size).toBe('lg');
  expect(avatar.classList.contains('cn-avatar')).toBe(true);
  expect(avatar.querySelector('[data-slot=avatar-image]')).toBeNull();
  expect(avatar.querySelector('[data-slot=avatar-fallback]')!.textContent).toBe('CN');
});

it('Separator exposes its orientation', () => {
  mounted.push(mount(Separator, { target: document.body, props: { orientation: 'vertical' } }));
  flushSync();
  const separator = document.querySelector<HTMLElement>('[data-slot=separator]')!;
  expect(separator.getAttribute('role')).toBe('separator');
  expect(separator.getAttribute('aria-orientation')).toBe('vertical');
  expect(separator.dataset.orientation).toBe('vertical');
});
