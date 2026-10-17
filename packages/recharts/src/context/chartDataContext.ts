import type { ChartData } from '../state/chartDataSlice.js';
import { useAppSelector, type Box } from '../state/hooks.svelte.js';
import type { RechartsRootState } from '../state/store.js';
import type { BrushStartEndIndex } from './brushUpdateContext.js';

const selectChartData = (state: RechartsRootState): ChartData | undefined => state.chartData.chartData;

/**
 * "data" is the data of the chart, as passed to the chart root (`<ComposedChart data={data} />`).
 * Charts whose data lives on their graphical items (`<PieChart><Pie data={data} />`) read undefined here.
 *
 * @deprecated use one of the other selectors instead - which one, depends on how do you identify the applicable graphical items.
 */
export const useChartData = (): Box<ChartData | undefined> => useAppSelector(selectChartData);

const selectDataIndex = (state: RechartsRootState): BrushStartEndIndex => {
  const { dataStartIndex, dataEndIndex } = state.chartData;
  return { startIndex: dataStartIndex, endIndex: dataEndIndex };
};

/** startIndex and endIndex are data boundaries, set through Brush. */
export const useDataIndex = (): Box<BrushStartEndIndex | undefined> => useAppSelector(selectDataIndex);
