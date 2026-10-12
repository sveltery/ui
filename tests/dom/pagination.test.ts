import { afterEach, expect, it } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount, type Component } from 'svelte';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '$ui/pagination/index.js';

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

const text = createRawSnippet(() => ({ render: () => '<span data-child>child</span>' }));

it('Pagination is a labelled navigation landmark', () => {
  const nav = render(Pagination, { children: text, class: 'extra' }).firstElementChild!;
  expect(nav.tagName).toBe('NAV');
  expect(nav.getAttribute('role')).toBe('navigation');
  expect(nav.getAttribute('aria-label')).toBe('pagination');
  expect(nav.getAttribute('data-slot')).toBe('pagination');
  expect(nav.className).toBe('cn-pagination mx-auto flex w-full justify-center extra');
  expect(nav.querySelector('[data-child]')!.textContent).toBe('child');
});

it('PaginationContent is a list and PaginationItem a list item', () => {
  const list = render(PaginationContent, { children: text, class: 'extra' }).firstElementChild!;
  expect(list.tagName).toBe('UL');
  expect(list.getAttribute('data-slot')).toBe('pagination-content');
  expect(list.className).toBe('cn-pagination-content flex items-center extra');
  const item = render(PaginationItem, { children: text, class: 'extra' }).lastElementChild!;
  expect(item.tagName).toBe('LI');
  expect(item.getAttribute('data-slot')).toBe('pagination-item');
  expect(item.className).toBe('extra');
});

it('PaginationLink is a ghost icon link when inactive', () => {
  const link = render(PaginationLink, { children: text, href: '/page/1', class: 'extra' }).firstElementChild!;
  expect(link.tagName).toBe('A');
  expect(link.getAttribute('href')).toBe('/page/1');
  expect(link.getAttribute('data-slot')).toBe('pagination-link');
  expect(link.hasAttribute('data-active')).toBe(false);
  expect(link.hasAttribute('aria-current')).toBe(false);
  expect(link.classList.contains('cn-button-variant-ghost')).toBe(true);
  expect(link.classList.contains('cn-button-size-icon')).toBe(true);
  expect(link.classList.contains('cn-pagination-link')).toBe(true);
  expect(link.classList.contains('extra')).toBe(true);
});

it('PaginationLink is an outline link marked as the current page when active', () => {
  const link = render(PaginationLink, { children: text, href: '/page/2', isActive: true }).firstElementChild!;
  expect(link.getAttribute('aria-current')).toBe('page');
  expect(link.getAttribute('data-active')).toBe('true');
  expect(link.classList.contains('cn-button-variant-outline')).toBe(true);
  expect(link.classList.contains('cn-button-variant-ghost')).toBe(false);
});

it('PaginationLink takes a button size', () => {
  const link = render(PaginationLink, { children: text, size: 'lg' }).firstElementChild!;
  expect(link.classList.contains('cn-button-size-lg')).toBe(true);
  expect(link.classList.contains('cn-button-size-icon')).toBe(false);
});

it('PaginationPrevious labels the link and shows its text and icon', () => {
  const link = render(PaginationPrevious, { href: '/page/1', class: 'extra' }).firstElementChild!;
  expect(link.tagName).toBe('A');
  expect(link.getAttribute('aria-label')).toBe('Go to previous page');
  expect(link.getAttribute('data-slot')).toBe('pagination-link');
  expect(link.getAttribute('href')).toBe('/page/1');
  expect(link.classList.contains('cn-button-size-default')).toBe(true);
  expect(link.classList.contains('cn-pagination-previous')).toBe(true);
  expect(link.classList.contains('extra')).toBe(true);
  expect(link.querySelector('svg')!.getAttribute('data-icon')).toBe('inline-start');
  expect(link.querySelector('span')!.className).toBe('cn-pagination-previous-text hidden sm:block');
  expect(link.querySelector('span')!.textContent).toBe('Previous');
  expect(link.firstElementChild!.tagName.toLowerCase()).toBe('svg');
});

it('PaginationNext puts its text before the icon and accepts custom text', () => {
  const link = render(PaginationNext, { href: '/page/3', text: 'Siguiente' }).firstElementChild!;
  expect(link.getAttribute('aria-label')).toBe('Go to next page');
  expect(link.querySelector('span')!.textContent).toBe('Siguiente');
  expect(link.querySelector('span')!.className).toBe('cn-pagination-next-text hidden sm:block');
  expect(link.querySelector('svg')!.getAttribute('data-icon')).toBe('inline-end');
  expect(link.lastElementChild!.tagName.toLowerCase()).toBe('svg');
  expect(render(PaginationNext, {}).lastElementChild!.querySelector('span')!.textContent).toBe('Next');
});

it('lets the caller override the aria-label of Previous', () => {
  expect(render(PaginationPrevious, { 'aria-label': 'Back' }).firstElementChild!.getAttribute('aria-label')).toBe('Back');
});

it('PaginationEllipsis hides the glyph and keeps a screen reader label', () => {
  const ellipsis = render(PaginationEllipsis, { class: 'extra' }).firstElementChild!;
  expect(ellipsis.tagName).toBe('SPAN');
  expect(ellipsis.getAttribute('aria-hidden')).toBe('true');
  expect(ellipsis.getAttribute('data-slot')).toBe('pagination-ellipsis');
  expect(ellipsis.className).toBe('cn-pagination-ellipsis flex items-center justify-center extra');
  expect(ellipsis.querySelector('svg')).not.toBe(null);
  expect(ellipsis.querySelector('.sr-only')!.textContent).toBe('More pages');
});
