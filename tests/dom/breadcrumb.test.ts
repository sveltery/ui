import { afterEach, expect, it } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount, type Component } from 'svelte';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '$ui/breadcrumb/index.js';
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

const text = createRawSnippet(() => ({ render: () => '<span data-child>child</span>' }));

const parts: [string, Component<never>, string, string, string][] = [
  ['Breadcrumb', Breadcrumb, 'NAV', 'breadcrumb', 'cn-breadcrumb'],
  ['BreadcrumbList', BreadcrumbList, 'OL', 'breadcrumb-list', 'cn-breadcrumb-list flex flex-wrap items-center wrap-break-word'],
  ['BreadcrumbItem', BreadcrumbItem, 'LI', 'breadcrumb-item', 'cn-breadcrumb-item inline-flex items-center'],
  ['BreadcrumbLink', BreadcrumbLink, 'A', 'breadcrumb-link', 'cn-breadcrumb-link'],
  ['BreadcrumbPage', BreadcrumbPage, 'SPAN', 'breadcrumb-page', 'cn-breadcrumb-page'],
  ['BreadcrumbSeparator', BreadcrumbSeparator, 'LI', 'breadcrumb-separator', 'cn-breadcrumb-separator'],
];

for (const [name, component, tag, slot, classes] of parts) {
  it(`${name} renders a ${tag.toLowerCase()} with its slot, upstream classes and children`, () => {
    const host = render(component, { children: text, class: 'extra', id: 'x' }).firstElementChild!;
    expect(host.tagName).toBe(tag);
    expect(host.getAttribute('data-slot')).toBe(slot);
    expect(host.className).toBe(`${classes} extra`);
    expect(host.id).toBe('x');
    expect(host.querySelector('[data-child]')!.textContent).toBe('child');
  });
}

it('labels the nav as breadcrumb unless the caller overrides it', () => {
  expect(render(Breadcrumb).firstElementChild!.getAttribute('aria-label')).toBe('breadcrumb');
  expect(render(Breadcrumb, { 'aria-label': 'Trail' }).lastElementChild!.getAttribute('aria-label')).toBe('Trail');
});

it('passes href through to the link', () => {
  expect(render(BreadcrumbLink, { href: '/docs', children: text }).firstElementChild!.getAttribute('href')).toBe('/docs');
});

it('marks the current page as a disabled link', () => {
  const page = render(BreadcrumbPage, { children: text }).firstElementChild!;
  expect(page.getAttribute('role')).toBe('link');
  expect(page.getAttribute('aria-disabled')).toBe('true');
  expect(page.getAttribute('aria-current')).toBe('page');
});

it('hides the separator from assistive technology and draws a chevron by default', () => {
  const separator = render(BreadcrumbSeparator).firstElementChild!;
  expect(separator.getAttribute('role')).toBe('presentation');
  expect(separator.getAttribute('aria-hidden')).toBe('true');
  expect(separator.querySelector('svg')!.getAttribute('class')).toBe('lucide lucide-chevron-right cn-rtl-flip');
});

it('renders custom children in place of the chevron', () => {
  const separator = render(BreadcrumbSeparator, { children: text }).firstElementChild!;
  expect(separator.querySelector('svg')).toBe(null);
  expect(separator.textContent).toBe('child');
});

it('draws the ellipsis icon with a screen reader label', () => {
  const ellipsis = render(BreadcrumbEllipsis, { class: 'extra' }).firstElementChild!;
  expect(ellipsis.getAttribute('data-slot')).toBe('breadcrumb-ellipsis');
  expect(ellipsis.getAttribute('role')).toBe('presentation');
  expect(ellipsis.getAttribute('aria-hidden')).toBe('true');
  expect(ellipsis.className).toBe('cn-breadcrumb-ellipsis flex items-center justify-center extra');
  expect(ellipsis.querySelector('svg')).not.toBe(null);
  expect(ellipsis.querySelector('.sr-only')!.textContent).toBe('More');
});

it('renders the link through a render snippet', () => {
  const link = render(RenderFixture, { component: BreadcrumbLink }).querySelector('a')!;
  expect(link.getAttribute('href')).toBe('/docs');
  expect(link.getAttribute('data-slot')).toBe('breadcrumb-link');
  expect(link.getAttribute('data-state-slot')).toBe('breadcrumb-link');
  expect(link.classList.contains('cn-breadcrumb-link')).toBe(true);
  expect(link.textContent!.trim()).toBe('Link text');
  expect(document.querySelectorAll('a').length).toBe(1);
});
