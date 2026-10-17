import { BaseCartesianAxis } from '../../cartesianAxisSlice.js';
import { AxisRange } from '../axisSelectors.js';

export const combineAxisRangeWithReverse = (
  axisSettings: BaseCartesianAxis | undefined,
  axisRange: AxisRange | undefined,
): AxisRange | undefined => {
  if (!axisSettings || !axisRange) {
    return undefined;
  }
  if (axisSettings?.reversed) {
    return [axisRange[1], axisRange[0]];
  }
  return axisRange;
};
