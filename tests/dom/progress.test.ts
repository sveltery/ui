import { afterEach, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import ProgressFixture from './ProgressFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;
afterEach(async () => { if (instance) await unmount(instance); document.body.replaceChildren(); });

function setup(props: { value?: number | null; labelled?: boolean } = {}) {
  instance = mount(ProgressFixture, { target: document.body, props });
  flushSync();
  const root = document.querySelector<HTMLElement>('[data-slot=progress]')!;
  return { root, set: (next: number | null) => { (instance as unknown as { set(v: number | null): void }).set(next); flushSync(); } };
}

it('renders a progressbar with the upstream slots and classes', () => {
  const { root } = setup();
  expect(root.getAttribute('role')).toBe('progressbar');
  expect(root.className).toBe('cn-progress-root flex flex-wrap gap-3 w-full');
  const track = root.querySelector('[data-slot=progress-track]')!;
  expect(track.className).toBe('cn-progress-track relative flex w-full items-center overflow-x-hidden');
  const indicator = track.querySelector<HTMLElement>('[data-slot=progress-indicator]')!;
  expect(indicator.className).toBe('cn-progress-indicator h-full transition-all');
});

it('reports the value to assistive technology and sizes the indicator', () => {
  const { root } = setup({ value: 56 });
  expect(root.getAttribute('aria-valuenow')).toBe('56');
  expect(root.getAttribute('aria-valuemin')).toBe('0');
  expect(root.getAttribute('aria-valuemax')).toBe('100');
  expect(root.dataset.progressing).toBe('');
  expect(root.querySelector<HTMLElement>('[data-slot=progress-indicator]')!.style.width).toBe('56%');
});

it('labels the bar and shows the formatted value', () => {
  const { root } = setup({ value: 56 });
  const label = root.querySelector<HTMLElement>('[data-slot=progress-label]')!;
  expect(label.textContent).toBe('Upload progress');
  expect(label.className).toBe('cn-progress-label');
  expect(root.getAttribute('aria-labelledby')).toBe(label.id);
  const value = root.querySelector<HTMLElement>('[data-slot=progress-value]')!;
  expect(value.className).toBe('cn-progress-value');
  expect(value.textContent).toBe('56%');
});

it('follows a changed value prop and reaches the complete state', () => {
  const { root, set } = setup({ value: 25 });
  expect(root.getAttribute('aria-valuenow')).toBe('25');
  set(100);
  expect(root.getAttribute('aria-valuenow')).toBe('100');
  expect(root.dataset.complete).toBe('');
  expect(root.querySelector<HTMLElement>('[data-slot=progress-indicator]')!.style.width).toBe('100%');
});

it('is indeterminate without a value', () => {
  const { root } = setup({ value: null, labelled: false });
  expect(root.hasAttribute('aria-valuenow')).toBe(false);
  expect(root.dataset.indeterminate).toBe('');
  expect(root.getAttribute('aria-label')).toBe('Plain');
});
