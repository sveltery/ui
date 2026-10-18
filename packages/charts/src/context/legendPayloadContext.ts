import type { LegendPayload } from '../component/DefaultLegendContent.js';
import { useAppSelector, type Box } from '../state/hooks.svelte.js';
import { selectLegendPayload } from '../state/selectors/legendSelectors.js';

/**
 * Use this hook in Legend, or anywhere else where you want to read the current Legend items.
 * @return all Legend items ready to be rendered
 */
export function useLegendPayload(): Box<ReadonlyArray<LegendPayload> | undefined> {
  return useAppSelector(selectLegendPayload);
}
