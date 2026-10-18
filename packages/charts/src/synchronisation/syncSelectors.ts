import { RechartsRootState } from '../state/store.js';
import { TooltipSyncState } from '../state/tooltipSlice.js';

export function selectSynchronisedTooltipState(state: RechartsRootState): TooltipSyncState {
  return state.tooltip.syncInteraction;
}
