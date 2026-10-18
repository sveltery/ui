import type { Box, Getter } from '../state/hooks.svelte.js';
import { uniqueId } from './DataUtils.js';

function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => Object.is(a[key], b[key]));
}

/**
 * Returns an animation id that changes when the input changes, and only then.
 * Upstream compares the props object by reference, which changes whenever the parent re-renders. Svelte has no
 * re-render, so the input is a getter returning those props, and a new id is issued when they differ shallowly.
 */
export function useAnimationId(input: Getter<Record<string, unknown>>, prefix: string = 'animation-'): Box<string> {
  let animationId = uniqueId(prefix);
  let prevProps: Record<string, unknown> | undefined;
  const current = $derived.by(() => {
    const next = input();
    if (prevProps !== undefined && !shallowEqual(prevProps, next)) {
      animationId = uniqueId(prefix);
    }
    prevProps = next;
    return animationId;
  });
  return {
    get current() {
      return current;
    },
  };
}
