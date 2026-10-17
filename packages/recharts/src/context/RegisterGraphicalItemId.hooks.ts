import { createContext } from 'svelte';
import type { GraphicalItemId } from '../state/graphicalItemsSlice.js';
import type { Box } from '../state/hooks.svelte.js';

export const [getGraphicalItemIdContext, setGraphicalItemIdContext, hasGraphicalItemIdContext] = createContext<Box<GraphicalItemId>>();

/** Must be called during component initialisation. */
export function useGraphicalItemId(): Box<GraphicalItemId> | undefined {
  return hasGraphicalItemIdContext() ? getGraphicalItemIdContext() : undefined;
}
