import { afterEach, expect, it } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount, type Component } from 'svelte';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '$ui/button-group/index.js';
import RenderFixture from './RenderFixture.svelte';

const mounted: ReturnType<typeof mount>[] = [];
afterEach(async () => {
  for (const instance of mounted.splice(0)) await unmount(instance);
  document.body.replaceChildren();
});

function render(component: Component<never>, props: Record<string, unknown> = {}) {
  const target = document.createElement('div');
  document.body.append(target);
  mounted.push(mount(component as Component<Record<string, unknown>>, { target, props }));
  flushSync();
  return target;
}

const text = createRawSnippet(() => ({ render: () => '<span>Label</span>' }));

it('renders a div group without a data-orientation until one is given', () => {
  const group = render(ButtonGroup, { children: text, class: 'w-96', 'aria-label': 'Actions' }).firstElementChild!;
  expect(group.tagName).toBe('DIV');
  expect(group.getAttribute('role')).toBe('group');
  expect(group.getAttribute('data-slot')).toBe('button-group');
  expect(group.hasAttribute('data-orientation')).toBe(false);
  expect(group.getAttribute('aria-label')).toBe('Actions');
  expect(group.className).toBe("cn-button-group flex items-stretch *:focus-visible:relative *:focus-visible:z-10 [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 cn-button-group-orientation-horizontal *:data-slot:rounded-r-none [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0 w-96");
  expect(group.classList.contains('cn-button-group-orientation-horizontal')).toBe(true);
  expect(group.textContent).toBe('Label');
});

it('applies the vertical orientation', () => {
  const group = render(ButtonGroup, { children: text, orientation: 'vertical' }).firstElementChild!;
  expect(group.getAttribute('data-orientation')).toBe('vertical');
  expect(group.classList.contains('cn-button-group-orientation-vertical')).toBe(true);
  expect(group.classList.contains('flex-col')).toBe(true);
  expect(group.classList.contains('cn-button-group-orientation-horizontal')).toBe(false);
});

it('renders the text part as a div and merges classes', () => {
  const part = render(ButtonGroupText, { children: text, class: 'font-mono' }).firstElementChild!;
  expect(part.tagName).toBe('DIV');
  expect(part.getAttribute('data-slot')).toBe('button-group-text');
  expect(part.className).toBe('cn-button-group-text flex items-center [&_svg]:pointer-events-none font-mono');
  expect(part.textContent).toBe('Label');
});

it('renders the text part through a render snippet', () => {
  const link = render(RenderFixture, { component: ButtonGroupText }).querySelector('a')!;
  expect(link.getAttribute('data-slot')).toBe('button-group-text');
  expect(link.getAttribute('data-state-slot')).toBe('button-group-text');
  expect(link.classList.contains('cn-button-group-text')).toBe(true);
  expect(link.textContent!.trim()).toBe('Link text');
  expect(document.querySelector('div[data-slot="button-group-text"]')).toBe(null);
});

it('renders a vertical separator by default', () => {
  const separator = render(ButtonGroupSeparator, { class: 'bg-red-500' }).firstElementChild!;
  expect(separator.getAttribute('role')).toBe('separator');
  expect(separator.getAttribute('data-slot')).toBe('button-group-separator');
  expect(separator.getAttribute('aria-orientation')).toBe('vertical');
  expect(separator.getAttribute('data-orientation')).toBe('vertical');
  expect(separator.classList.contains('cn-button-group-separator')).toBe(true);
  expect(separator.classList.contains('bg-red-500')).toBe(true);
});

it('renders a horizontal separator on request', () => {
  const separator = render(ButtonGroupSeparator, { orientation: 'horizontal' }).firstElementChild!;
  expect(separator.getAttribute('data-orientation')).toBe('horizontal');
  expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
});
