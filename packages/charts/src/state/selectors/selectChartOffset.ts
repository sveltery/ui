import { createSelector } from 'reselect';
import { selectChartOffsetInternal } from './selectChartOffsetInternal.js';
import { ChartOffsetInternal } from '../../util/types.js';
import { ChartOffset } from '../../types.js';

export const selectChartOffset = createSelector(
  [selectChartOffsetInternal],
  (offsetInternal: ChartOffsetInternal): ChartOffset => {
    return {
      top: offsetInternal.top,
      bottom: offsetInternal.bottom,
      left: offsetInternal.left,
      right: offsetInternal.right,
    };
  },
);
