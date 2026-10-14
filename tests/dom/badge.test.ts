import { afterEach, expect, it } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount, type Component } from 'svelte';
import { Badge } from '$ui/badge/index.js';
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

const text = createRawSnippet(() => ({ render: () => '<span>New</span>' }));

it('renders a span with the badge slot, variant and classes', () => {
  const badge = render(Badge, { children: text, class: 'ml-2', id: 'status' }).firstElementChild!;
  expect(badge.tagName).toBe('SPAN');
  expect(badge.getAttribute('data-slot')).toBe('badge');
  expect(badge.getAttribute('data-variant')).toBe('default');
  expect(badge.id).toBe('status');
  expect(badge.className).toBe('cn-badge group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none cn-badge-variant-default ml-2');
  expect(badge.textContent).toBe('New');
});

it('applies the variant class and data attribute', () => {
  const badge = render(Badge, { children: text, variant: 'outline' }).firstElementChild!;
  expect(badge.getAttribute('data-variant')).toBe('outline');
  expect(badge.classList.contains('cn-badge-variant-outline')).toBe(true);
  expect(badge.classList.contains('cn-badge-variant-default')).toBe(false);
});

it('renders through a render snippet onto a link', () => {
  const link = render(RenderFixture, { component: Badge, variant: 'secondary' }).querySelector('a')!;
  expect(link.getAttribute('href')).toBe('/docs');
  expect(link.getAttribute('data-slot')).toBe('badge');
  expect(link.getAttribute('data-variant')).toBe('secondary');
  expect(link.getAttribute('data-state-slot')).toBe('badge');
  expect(link.classList.contains('cn-badge-variant-secondary')).toBe(true);
  expect(link.textContent!.trim()).toBe('Link text');
  expect(document.querySelector('span[data-slot="badge"]')).toBe(null);
});

it('a null variant adds no variant class or attribute', () => {
  const badge = render(Badge, { children: text, variant: null }).firstElementChild!;
  expect(badge.hasAttribute('data-variant')).toBe(false);
  expect([...badge.classList].filter(name => name.startsWith('cn-badge-variant'))).toEqual([]);
});
