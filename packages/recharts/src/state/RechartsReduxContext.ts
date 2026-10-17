import { createContext } from 'svelte';
import { createSubscriber } from 'svelte/reactivity';
import type { Action, Store } from '@reduxjs/toolkit';
import { createRechartsStore, type RechartsRootState } from './store.js';

/**
 * Recharts' own store context, so a chart never reads another Redux store on the page.
 * `subscribe` is the one store subscription every selector of the chart shares; calling it inside a
 * reactive read makes that read re-run when the store notifies.
 */
export type RechartsReduxContextValue = {
  readonly store: Store<RechartsRootState, Action>;
  readonly subscribe: () => void;
};

export const [getRechartsReduxContext, setRechartsReduxContext, hasRechartsReduxContext] = createContext<RechartsReduxContextValue>();

export function createRechartsReduxContextValue(preloadedState?: Partial<RechartsRootState>, reduxStoreName?: string): RechartsReduxContextValue {
  const store = createRechartsStore(preloadedState, reduxStoreName);
  return { store, subscribe: createSubscriber((update) => store.subscribe(update)) };
}
