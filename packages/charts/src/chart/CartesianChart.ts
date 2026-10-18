import { CartesianChartProps, Margin, TooltipEventType } from '../util/types.js';
import { TooltipPayloadSearcher } from '../state/tooltipSlice.js';
import { initialEventSettingsState } from '../state/eventSettingsSlice.js';
const defaultMargin: Margin = { top: 5, right: 5, bottom: 5, left: 5 };
export const defaultCartesianChartProps = {
  accessibilityLayer: true,
  barCategoryGap: '10%',
  barGap: 4,
  layout: 'horizontal',
  margin: defaultMargin,
  responsive: false,
  reverseStackOrder: false,
  stackOffset: 'none',
  syncMethod: 'index',
  ...initialEventSettingsState,
} as const satisfies Partial<CartesianChartProps>;
/**
 * These are one-time, immutable options that decide the chart's behavior.
 * Users who wish to call CartesianChart may decide to pass these options explicitly,
 * but usually we would expect that they use one of the convenience components like BarChart, LineChart, etc.
 */
export type CartesianChartOptions = {
  chartName: string;
  defaultTooltipEventType: TooltipEventType;
  validateTooltipEventTypes: ReadonlyArray<TooltipEventType>;
  tooltipPayloadSearcher: TooltipPayloadSearcher;
  categoricalChartProps: CartesianChartProps;
};
