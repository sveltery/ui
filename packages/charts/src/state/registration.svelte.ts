import { untrack } from 'svelte';
import type { Box, Getter } from './hooks.svelte.js';
import { toStoreValue } from './toStoreValue.js';

export type Registration<T> = {
  add(value: T): void;
  replace(prev: T, next: T): void;
  remove(value: T): void;
};

/**
 * The add, replace and remove protocol of upstream's Set* components (state/SetGraphicalItem.ts:16-40), written once.
 * The first effect adds the value, then replaces it whenever it changes; replace keeps its index in the store array.
 * `value()` returning undefined skips that run and keeps what is registered, like upstream's early returns.
 * The second effect removes the value when the component is destroyed.
 * The returned box holds the copy that went into the store while it belongs to the current value, and null before
 * the current value is registered. Upstream compares its settings object with the store's by reference
 * (polar/PolarAngleAxis.tsx:276), and the store holds this copy.
 */
export function useRegistration<T>(value: Getter<T | undefined>, ops: Registration<T>): Box<T | null> {
  let prev: T | null = null;
  let registered = $state.raw<{ source: T; stored: T } | null>(null);
  $effect(() => {
    const current = value();
    if (current === undefined) return;
    const next = toStoreValue(current);
    untrack(() => {
      if (prev === null) ops.add(next);
      else if (prev !== next) ops.replace(prev, next);
      prev = next;
      registered = { source: current, stored: next };
    });
  });
  $effect(() => () => {
    if (prev !== null) {
      ops.remove(prev);
      prev = null;
    }
  });
  return {
    get current() {
      const entry = registered;
      return entry !== null && entry.source === value() ? entry.stored : null;
    },
  };
}
