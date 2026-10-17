import { useAppSelector, type Box } from './state/hooks.svelte.js';
import { selectPlotArea } from './state/selectors/selectPlotArea.js';
import type { PlotArea } from './types.js';

/**
 * Reads the plot area, where bars, lines and points are drawn: its size in pixels and the position of its top-left
 * corner relative to the chart container. Zoom does not change it. Reads `undefined` outside a chart.
 * @since 3.1
 */
export const usePlotArea = (): Box<PlotArea | undefined> => useAppSelector(selectPlotArea);
