import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';
import type { Box } from '../state/hooks.svelte.js';
import { Global } from './Global.js';

const motionAllowed: Box<boolean> = { current: false };

/** Reads the user's `prefers-reduced-motion` preference and follows its changes. Reads false during server-side rendering. */
export function usePrefersReducedMotion(): Box<boolean> {
  if (Global.isSsr || typeof window.matchMedia !== 'function') return motionAllowed;
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const subscribe = createSubscriber((update) => on(mediaQuery, 'change', update));
  return {
    get current() {
      subscribe();
      return mediaQuery.matches;
    },
  };
}
