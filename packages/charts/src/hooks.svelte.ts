import { useAppSelector, type Box } from './state/hooks.svelte.js';
import { selectPlotArea } from './state/selectors/selectPlotArea.js';
import { selectActiveTooltipDataPoints } from './state/selectors/tooltipSelectors.js';
import type { PlotArea } from './types.js';

/**
 * Reads the plot area, where bars, lines and points are drawn: its size in pixels and the position of its top-left
 * corner relative to the chart container. Zoom does not change it. Reads `undefined` outside a chart.
 * @since 3.1
 */
export const usePlotArea = (): Box<PlotArea | undefined> => useAppSelector(selectPlotArea);

/**
 * Reads the data points the Tooltip currently shows: the objects passed in the chart's `data`, one per graphical item
 * when the Tooltip is shared. Follows the Tooltip props, or the default ones without a Tooltip. Reads `undefined`
 * while nothing is active, and outside a chart.
 */
export const useActiveTooltipDataPoints = <T = unknown>(): Box<ReadonlyArray<T> | undefined> =>
  useAppSelector(selectActiveTooltipDataPoints) as Box<ReadonlyArray<T> | undefined>;
