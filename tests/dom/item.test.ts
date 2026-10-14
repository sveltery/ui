import { afterEach, expect, it } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount, type Component } from 'svelte';
import {
  Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle,
} from '$ui/item/index.js';
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

const text = createRawSnippet(() => ({ render: () => '<span>Content</span>' }));

it('renders a default item div with slot, variant and size', () => {
  const item = render(Item, { children: text, class: 'mt-2', id: 'row' }).firstElementChild!;
  expect(item.tagName).toBe('DIV');
  expect(item.id).toBe('row');
  expect(item.getAttribute('data-slot')).toBe('item');
  expect(item.getAttribute('data-variant')).toBe('default');
  expect(item.getAttribute('data-size')).toBe('default');
  expect(item.className).toBe('cn-item group/item flex w-full flex-wrap items-center transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors cn-item-variant-default cn-item-size-default mt-2');
  expect(item.textContent).toBe('Content');
});

it('applies the variant and size classes and data attributes', () => {
  const item = render(Item, { children: text, variant: 'outline', size: 'xs' }).firstElementChild!;
  expect(item.getAttribute('data-variant')).toBe('outline');
  expect(item.getAttribute('data-size')).toBe('xs');
  expect(item.classList.contains('cn-item-variant-outline')).toBe(true);
  expect(item.classList.contains('cn-item-size-xs')).toBe(true);
  expect(item.classList.contains('cn-item-variant-default')).toBe(false);
});

it('renders the item through a render snippet onto a link', () => {
  const link = render(RenderFixture, { component: Item, variant: 'muted', size: 'sm' }).querySelector('a')!;
  expect(link.getAttribute('data-slot')).toBe('item');
  expect(link.getAttribute('data-variant')).toBe('muted');
  expect(link.getAttribute('data-size')).toBe('sm');
  expect(link.getAttribute('data-state-slot')).toBe('item');
  expect(link.classList.contains('cn-item-variant-muted')).toBe(true);
  expect(link.textContent!.trim()).toBe('Link text');
  expect(document.querySelector('div[data-slot="item"]')).toBe(null);
});

it('renders the group as a list', () => {
  const group = render(ItemGroup, { children: text }).firstElementChild!;
  expect(group.tagName).toBe('DIV');
  expect(group.getAttribute('role')).toBe('list');
  expect(group.getAttribute('data-slot')).toBe('item-group');
  expect(group.className).toBe('cn-item-group group/item-group flex w-full flex-col');
});

it('renders the media variants', () => {
  const plain = render(ItemMedia, { children: text }).firstElementChild!;
  expect(plain.getAttribute('data-slot')).toBe('item-media');
  expect(plain.getAttribute('data-variant')).toBe('default');
  expect(plain.classList.contains('cn-item-media-variant-default')).toBe(true);
  const icon = render(ItemMedia, { children: text, variant: 'icon', class: 'size-10' }).firstElementChild!;
  expect(icon.getAttribute('data-variant')).toBe('icon');
  expect(icon.classList.contains('cn-item-media-variant-icon')).toBe(true);
  expect(icon.classList.contains('size-10')).toBe(true);
});

it('renders a horizontal separator that merges classes', () => {
  const separator = render(ItemSeparator, { class: 'my-0' }).firstElementChild!;
  expect(separator.getAttribute('role')).toBe('separator');
  expect(separator.getAttribute('data-slot')).toBe('item-separator');
  expect(separator.getAttribute('data-orientation')).toBe('horizontal');
  expect(separator.classList.contains('cn-item-separator')).toBe(true);
  expect(separator.classList.contains('my-0')).toBe(true);
});

const parts: [string, Component<never>, string, string, string][] = [
  ['ItemContent', ItemContent, 'div', 'item-content', 'cn-item-content flex flex-1 flex-col [&+[data-slot=item-content]]:flex-none'],
  ['ItemTitle', ItemTitle, 'div', 'item-title', 'cn-item-title line-clamp-1 flex w-fit items-center'],
  ['ItemDescription', ItemDescription, 'p', 'item-description', 'cn-item-description line-clamp-2 font-normal [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary'],
  ['ItemActions', ItemActions, 'div', 'item-actions', 'cn-item-actions flex items-center'],
  ['ItemHeader', ItemHeader, 'div', 'item-header', 'cn-item-header flex basis-full items-center justify-between'],
  ['ItemFooter', ItemFooter, 'div', 'item-footer', 'cn-item-footer flex basis-full items-center justify-between'],
];

for (const [name, component, tag, slot, classes] of parts) {
  it(`${name} renders a ${tag} with its slot, classes, children and caller class`, () => {
    const part = render(component, { children: text, class: 'extra', title: 'hint' }).firstElementChild!;
    expect(part.tagName.toLowerCase()).toBe(tag);
    expect(part.getAttribute('data-slot')).toBe(slot);
    expect(part.getAttribute('title')).toBe('hint');
    expect(part.className).toBe(`${classes} extra`);
    expect(part.textContent).toBe('Content');
  });
}

it('a null variant and size add no variant classes or attributes', () => {
  const item = render(Item, { children: text, variant: null, size: null }).firstElementChild!;
  expect(item.hasAttribute('data-variant')).toBe(false);
  expect(item.hasAttribute('data-size')).toBe(false);
  expect(item.className).toBe('cn-item group/item flex w-full flex-wrap items-center transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors');
});
