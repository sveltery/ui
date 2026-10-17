import * as React from '../react.js';
import { CSSProperties } from '../react.js';
import { Props as TextProps } from '../component/Text.js';
import { TooltipIndex } from '../state/tooltipSlice.js';
import { ChartCoordinate, DataKey, EventThrottlingProps, Percent } from '../util/types.js';
import { WithIdRequired } from '../util/useUniqueId.js';
import { RequiresDefaultProps } from '../util/resolveDefaultProps.js';
import { initialEventSettingsState } from '../state/eventSettingsSlice.js';
export interface SunburstData {
  [key: string]: any;
  name: string;
  value?: number;
  fill?: string;
  tooltipIndex?: TooltipIndex;
  children?: SunburstData[];
}
/**
 * We require tooltipIndex on each node internally to track which node is active in the tooltip.
 * This is not required from the outside user - we can calculate it as we traverse the tree.
 */
interface SunburstNode extends SunburstData {
  tooltipIndex: TooltipIndex;
}
export interface SunburstChartProps extends EventThrottlingProps {
  className?: string;
  /**
   * The source data. Each element should be an object.
   * The properties of each object represent the values of different data dimensions.
   *
   * Use the `dataKey` prop to specify which properties to use.
   *
   * @example data={[{ name: 'a', value: 12, fill: '#8884d8' }, { name: 'b', value: 5, fill: '#83a6ed' }]}
   */
  data: SunburstData;
  /**
   * The width of chart container.
   * Can be a number or a percent string like "100%".
   *
   * @see {@link https://recharts.github.io/en-US/guide/sizes/ Chart sizing guide}
   */
  width?: number | Percent;
  /**
   * The height of chart container.
   * Can be a number or a percent string like "100%".
   *
   * @see {@link https://recharts.github.io/en-US/guide/sizes/ Chart sizing guide}
   */
  height?: number | Percent;
  /**
   * If true, then it will listen to container size changes and adapt the SVG chart accordingly.
   * If false, then it renders the chart at the specified width and height and will stay that way
   * even if the container size changes.
   *
   * This is similar to ResponsiveContainer but without the need for an extra wrapper component.
   * The `responsive` prop also uses standard CSS sizing rules, instead of custom resolution logic (like ResponsiveContainer does).
   * @default false
   */
  responsive?: boolean;
  /**
   * Distance between sectors.
   *
   * @defaultValue 2
   */
  padding?: number;
  /**
   * Decides how to extract value from the data.
   *
   * @defaultValue value
   */
  dataKey?: string;
  /**
   * Name represents each sector in the tooltip.
   * This allows you to extract the name from the data:
   *
   * - `string`: the name of the field in the data object;
   * - `number`: the index of the field in the data;
   * - `function`: a function that receives the data object and returns the name.
   *
   * @defaultValue name
   */
  nameKey?: DataKey<any>;
  /**
   * Padding between each hierarchical level.
   */
  ringPadding?: number;
  /**
   * The radius of the inner circle at the center of the chart.
   *
   * @defaultValue 50
   */
  innerRadius?: number;
  /**
   * Outermost edge of the chart.
   * Defaults to the max possible radius for a circle inscribed in the chart container
   */
  outerRadius?: number;
  /**
   * The x-coordinate of center in pixels.
   * If undefined, it will be set to half of the chart width.
   */
  cx?: number;
  /**
   * The y-coordinate of center in pixels.
   * If undefined, it will be set to half of the chart height.
   */
  cy?: number;
  /** Angle in degrees from which the chart should start. */
  startAngle?: number;
  /** Angle, in degrees, at which the chart should end. */
  endAngle?: number;
  children?: React.ReactNode;
  fill?: string;
  stroke?: string;
  /**
   * An object with svg text options to control the appearance of the chart labels.
   */
  textOptions?: TextProps;

  onMouseEnter?: (node: SunburstData, e: React.MouseEvent) => void;

  onMouseLeave?: (node: SunburstData, e: React.MouseEvent) => void;

  onClick?: (node: SunburstData) => void;
  style?: CSSProperties;
  id?: string;
}
interface DrawArcOptions {
  radius: number;
  innerR: number;
  initialAngle: number;
  childColor?: string;
  nestedActiveTooltipIndex?: TooltipIndex | undefined;
}
const defaultTextProps = {
  fontWeight: 'bold',
  paintOrder: 'stroke fill',
  fontSize: '.75rem',
  stroke: '#FFF',
  fill: 'black',
  pointerEvents: 'none',
};
type SunburstPositionMap = Map<string, ChartCoordinate>;
export const defaultSunburstChartProps = {
  padding: 2,
  dataKey: 'value',
  nameKey: 'name',
  ringPadding: 2,
  innerRadius: 50,
  fill: '#333',
  stroke: '#FFF',
  textOptions: defaultTextProps,
  startAngle: 0,
  endAngle: 360,
  responsive: false,
  ...initialEventSettingsState,
} as const satisfies Partial<SunburstChartProps>;
type InternalSunburstChartProps = WithIdRequired<
  RequiresDefaultProps<SunburstChartProps, typeof defaultSunburstChartProps>
>;
