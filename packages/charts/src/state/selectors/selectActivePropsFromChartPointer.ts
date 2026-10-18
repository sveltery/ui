import { createSelector } from 'reselect';
import { RechartsRootState } from '../store.js';
import { ActiveTooltipProps } from '../tooltipSlice.js';
import { selectChartLayout } from '../../context/chartLayoutContext.js';
import { selectTooltipAxisRangeWithReverse, selectTooltipAxisTicks } from './tooltipSelectors.js';
import { selectChartOffsetInternal } from './selectChartOffsetInternal.js';
import { combineActiveProps, selectOrderedTooltipTicks } from './selectors.js';
import { selectPolarViewBox } from './polarAxisSelectors.js';
import { RelativePointer } from '../../util/types.js';
import { selectTooltipAxisType } from './selectTooltipAxisType.js';

const pickChartPointer = (_state: RechartsRootState, chartPointer: RelativePointer) => chartPointer;

export const selectActivePropsFromChartPointer: (
  state: RechartsRootState,
  chartPointer: RelativePointer,
) => ActiveTooltipProps | undefined = createSelector(
  [
    pickChartPointer,
    selectChartLayout,
    selectPolarViewBox,
    selectTooltipAxisType,
    selectTooltipAxisRangeWithReverse,
    selectTooltipAxisTicks,
    selectOrderedTooltipTicks,
    selectChartOffsetInternal,
  ],
  combineActiveProps,
);
