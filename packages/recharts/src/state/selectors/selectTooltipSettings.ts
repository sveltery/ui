import { RechartsRootState } from '../store.js';
import { TooltipSettingsState } from '../tooltipSlice.js';

export const selectTooltipSettings = (state: RechartsRootState): TooltipSettingsState => state.tooltip.settings;
