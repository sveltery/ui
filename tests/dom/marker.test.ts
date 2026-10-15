import { afterEach, expect, it } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount, type Component } from 'svelte';
import { Marker, MarkerContent, MarkerIcon, markerVariants } from '$ui/marker/index.js';
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

const text = createRawSnippet(() => ({ render: () => '<span data-child>Worked for 42s</span>' }));
const base = 'cn-marker group/marker relative flex w-full items-center';

it('renders a div with the marker slot, default variant and classes', () => {
  const marker = render(Marker, { children: text, class: 'ml-2', role: 'status' }).firstElementChild!;
  expect(marker.tagName).toBe('DIV');
  expect(marker.getAttribute('data-slot')).toBe('marker');
  expect(marker.getAttribute('data-variant')).toBe('default');
  expect(marker.getAttribute('role')).toBe('status');
  expect(marker.className).toBe(`${base} cn-marker-variant-default ml-2`);
  expect(marker.textContent).toBe('Worked for 42s');
});

it('applies the separator and border variants', () => {
  const separator = render(Marker, { variant: 'separator' }).firstElementChild!;
  expect(separator.getAttribute('data-variant')).toBe('separator');
  expect(separator.className).toBe(`${base} cn-marker-variant-separator`);
  const border = render(Marker, { variant: 'border' }).lastElementChild!;
  expect(border.getAttribute('data-variant')).toBe('border');
  expect(border.className).toBe(`${base} cn-marker-variant-border`);
});

it('markerVariants adds no variant class without a variant', () => {
  expect(markerVariants()).toBe(base);
  expect(markerVariants({ variant: 'border' })).toBe(`${base} cn-marker-variant-border`);
});

it('renders through a render snippet onto a link', () => {
  const link = render(RenderFixture, { component: Marker, variant: 'border' }).querySelector('a')!;
  expect(link.getAttribute('href')).toBe('/docs');
  expect(link.getAttribute('data-slot')).toBe('marker');
  expect(link.getAttribute('data-variant')).toBe('border');
  expect(link.getAttribute('data-state-slot')).toBe('marker');
  expect(link.className).toBe(`${base} cn-marker-variant-border`);
  expect(link.textContent!.trim()).toBe('Link text');
  expect(document.querySelector('div[data-slot="marker"]')).toBe(null);
});

it('MarkerIcon is a decorative span', () => {
  const icon = render(MarkerIcon, { children: text, class: 'extra' }).firstElementChild!;
  expect(icon.tagName).toBe('SPAN');
  expect(icon.getAttribute('data-slot')).toBe('marker-icon');
  expect(icon.getAttribute('aria-hidden')).toBe('true');
  expect(icon.className).toBe('cn-marker-icon shrink-0 extra');
  expect(icon.textContent).toBe('Worked for 42s');
});

it('MarkerContent is a span that wraps long text', () => {
  const content = render(MarkerContent, { children: text, class: 'shimmer' }).firstElementChild!;
  expect(content.tagName).toBe('SPAN');
  expect(content.getAttribute('data-slot')).toBe('marker-content');
  expect(content.className).toBe('cn-marker-content min-w-0 wrap-break-word shimmer');
  expect(content.textContent).toBe('Worked for 42s');
});

it('a null variant adds no variant class or attribute', () => {
  const marker = render(Marker, { children: text, variant: null }).firstElementChild!;
  expect(marker.hasAttribute('data-variant')).toBe(false);
  expect(marker.className).toBe(base);
});
