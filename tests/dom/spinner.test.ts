import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount, type Component } from 'svelte';
import { Spinner } from '$ui/spinner/index.js';

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

it('renders a Lucide loader svg announced as a status', () => {
  const svg = render(Spinner).firstElementChild!;
  expect(svg.tagName.toLowerCase()).toBe('svg');
  expect(svg.getAttribute('data-slot')).toBe('spinner');
  expect(svg.getAttribute('role')).toBe('status');
  expect(svg.getAttribute('aria-label')).toBe('Loading');
  expect(svg.getAttribute('class')).toBe('lucide lucide-loader-2 size-4 animate-spin');
  expect(svg.querySelectorAll('path').length).toBeGreaterThan(0);
});

it('merges and overrides classes and attributes from the caller', () => {
  const svg = render(Spinner, { class: 'size-6 text-red-500', 'aria-label': 'Saving', 'data-icon': 'inline-start' }).firstElementChild!;
  expect(svg.getAttribute('class')).toBe('lucide lucide-loader-2 animate-spin size-6 text-red-500');
  expect(svg.getAttribute('aria-label')).toBe('Saving');
  expect(svg.getAttribute('data-icon')).toBe('inline-start');
  expect(svg.getAttribute('role')).toBe('status');
});
