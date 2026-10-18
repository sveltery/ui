import { RechartsRootState } from '../store.js';
import { AxisId } from '../cartesianAxisSlice.js';

export const selectTooltipAxisId = (state: RechartsRootState): AxisId => state.tooltip.settings.axisId;
