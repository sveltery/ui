import { createContext } from 'svelte';
import type { AxisId } from '../state/cartesianAxisSlice.js';
import type { ErrorBarDataPointFormatter } from '../cartesian/ErrorBar.js';
import type { BarRectangleItem } from '../cartesian/Bar.js';
import type { LinePointItem } from '../cartesian/Line.js';
import type { ScatterPointItem } from '../cartesian/Scatter.js';
import type { Box } from '../state/hooks.svelte.js';

export type ErrorBarContextType<T extends BarRectangleItem | LinePointItem | ScatterPointItem> = {
  data: ReadonlyArray<T> | undefined;
  xAxisId: AxisId;
  yAxisId: AxisId;
  dataPointFormatter: ErrorBarDataPointFormatter<T>;
  errorBarOffset: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- upstream's context type, read by every kind of item
type AnyItem = any;

const initialContextState: Box<ErrorBarContextType<AnyItem>> = {
  current: {
    data: [],
    xAxisId: 'xAxis-0',
    yAxisId: 'yAxis-0',
    dataPointFormatter: () => ({ x: 0, y: 0, value: 0 }),
    errorBarOffset: 0,
  },
};

const [getErrorBarContext, setErrorBarContext, hasErrorBarContext] = createContext<Box<ErrorBarContextType<AnyItem>>>();

export { setErrorBarContext };

/** Must be called during component initialisation. */
export const useErrorBarContext = (): Box<ErrorBarContextType<AnyItem>> => (hasErrorBarContext() ? getErrorBarContext() : initialContextState);
