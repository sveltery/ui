import { untrack } from 'svelte';
import type { Getter } from './hooks.svelte.js';
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
 */
export function useRegistration<T>(value: Getter<T | undefined>, ops: Registration<T>): void {
  let prev: T | null = null;
  $effect(() => {
    const current = value();
    if (current === undefined) return;
    const next = toStoreValue(current);
    untrack(() => {
      if (prev === null) ops.add(next);
      else if (prev !== next) ops.replace(prev, next);
      prev = next;
    });
  });
  $effect(() => () => {
    if (prev !== null) {
      ops.remove(prev);
      prev = null;
    }
  });
}
