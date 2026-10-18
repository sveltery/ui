import type { AppDispatch, RechartsRootState } from './store.js';
import { getRechartsReduxContext, hasRechartsReduxContext } from './RechartsReduxContext.js';

/** What every hook returns: Svelte has no re-render, so a hook hands back a reactive reader instead of a value. */
export type Box<T> = { readonly current: T };

/** A reactive input to a hook, re-read wherever the hook tracks it. */
export type Getter<T> = () => T;

const noopDispatch: AppDispatch = (a) => a;

/** Must be called during component initialisation. Outside a chart it returns a dispatch that does nothing. */
export function useAppDispatch(): AppDispatch {
  return hasRechartsReduxContext() ? getRechartsReduxContext().store.dispatch : noopDispatch;
}

const outOfContext: Box<undefined> = { current: undefined };

/**
 * Upstream's useAppSelector. Must be called during component initialisation. The selector re-runs inside a
 * $derived, so it may read reactive props and they are tracked; the result propagates only when it changes (===).
 * Outside a chart it never calls the selector and reads undefined.
 */
export function useAppSelector<T>(selector: (state: RechartsRootState) => T): Box<T | undefined> {
  if (!hasRechartsReduxContext()) return outOfContext;
  const { store, subscribe } = getRechartsReduxContext();
  const value = $derived.by(() => {
    subscribe();
    return selector(store.getState());
  });
  return {
    get current() {
      // An untracked read (an event handler) has no live subscription behind it, so it reads the store directly.
      return $effect.tracking() ? value : selector(store.getState());
    },
  };
}
