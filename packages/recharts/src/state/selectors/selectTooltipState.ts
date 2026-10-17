import { RechartsRootState } from '../store.js';
import { TooltipState } from '../tooltipSlice.js';

export const selectTooltipState = (state: RechartsRootState): TooltipState => state.tooltip;
