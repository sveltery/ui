import { flushSync, mount, unmount, type Component } from 'svelte';
import { afterEach, vi } from 'vitest';

const mounted: Array<() => void> = [];

afterEach(() => {
  while (mounted.length) mounted.pop()?.();
});

/** Runs effects, then the store's rAF-batched notification, until both are idle. */
export function settle(): void {
  for (let i = 0; i < 5; i++) {
    flushSync();
    vi.runOnlyPendingTimers();
  }
  flushSync();
}

/** Mounts a component into a fresh element in the body and unmounts it after the test. */
export function render<Props extends Record<string, unknown>, Exports extends Record<string, unknown>>(
  component: Component<Props, Exports>,
  props: Props,
): { target: HTMLElement; instance: Exports } {
  const target = document.createElement('div');
  document.body.append(target);
  const instance = mount(component, { target, props });
  mounted.push(() => {
    void unmount(instance);
    target.remove();
  });
  settle();
  return { target, instance };
}

/** The markup of a node without Svelte's comment anchors. */
export function markup(node: Element): string {
  return node.innerHTML.replace(/<!---->/g, '');
}
