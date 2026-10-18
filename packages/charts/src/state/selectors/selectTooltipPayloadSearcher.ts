import { RechartsRootState } from '../store.js';
import { TooltipPayloadSearcher } from '../tooltipSlice.js';

export const selectTooltipPayloadSearcher = (state: RechartsRootState): TooltipPayloadSearcher =>
  state.options.tooltipPayloadSearcher;
