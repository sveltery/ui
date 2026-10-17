import { CurveType, Props as CurveProps } from '../shape/Curve.js';
import { ImplicitLabelListType } from '../component/LabelList.js';
import { ErrorBarDataItem, ErrorBarDataPointFormatter } from './ErrorBar.js';
import { isNullish } from '../util/DataUtils.js';
import { getCateCoordinateOfLine, getTooltipNameProp, getValueByDataKey } from '../util/ChartUtils.js';
import { ActiveDotType, ActiveShape, AnimationDuration, AnimationTiming, CartesianLayout, DataConsumer, DataKey, DataProvider, DotType, LegendType, TickItem, TooltipType } from '../util/types.js';
import type { LegendPayload } from '../component/DefaultLegendContent.js';
import { BaseAxisWithScale } from '../state/selectors/axisSelectors.js';
import { AxisId } from '../state/cartesianAxisSlice.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
import { GraphicalItemId } from '../state/graphicalItemsSlice.js';
import { ChartData } from '../state/chartDataSlice.js';
export interface LinePointItem {
  readonly value: number;
  readonly payload?: any;
  /**
   * Line coordinates can have gaps in them. We have `connectNulls` prop that allows to connect those gaps anyway.
   * What it means is that some points can have `null` x or y coordinates.
   */
  x: number | null;
  y: number | null;
}
/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */
interface InternalLineProps extends ZIndexable {
  activeDot: ActiveDotType;
  animateNewValues: boolean;
  animationBegin: number;
  animationDuration: AnimationDuration;
  animationEasing: AnimationTiming;

  className?: string;
  connectNulls: boolean;
  data?: any;
  dataKey?: DataKey<any>;
  dot: DotType;
  height: number;
  hide: boolean;
  id: GraphicalItemId;
  isAnimationActive: boolean | 'auto';
  label: ImplicitLabelListType;
  layout: 'horizontal' | 'vertical';
  left: number;
  legendType: LegendType;
  shape?: ActiveShape<CurveProps, SVGPathElement>;

  name?: string | number;
  needClip?: boolean;

  onAnimationEnd?: () => void;
  onAnimationStart?: () => void;

  points: ReadonlyArray<LinePointItem>;
  tooltipType?: TooltipType;
  top: number;
  type?: CurveType;
  unit?: string | number | null;
  width: number;
  xAxisId: AxisId;
  yAxisId: AxisId;
}
/**
 * External props, intended for end users to fill in
 */
interface LineProps<DataPointType = any, DataValueType = any>
  extends DataProvider<DataPointType>, DataConsumer<DataPointType, DataValueType>, ZIndexable {
  /**
   * The active dot is rendered on the closest data point when user interacts with the chart. Options:
   *
   * - `false`: dots do not change on user activity; both active and inactive dots follow the `dot` prop (see below)
   * - `true`: renders the active dot with default settings
   * - `object`: the props of the active dot. This will be merged with the internal calculated props of the active dot
   * - `ReactElement`: the custom active dot element
   * - `function`: a render function of the custom active dot
   *
   * @defaultValue true
   * @example <Line dataKey="value" activeDot={false} />
   * @example <Line dataKey="value" activeDot={{ stroke: 'red', strokeWidth: 2, r: 10 }} />
   * @example <Line dataKey="value" activeDot={CustomizedActiveDot} />
   *
   * @see {@link https://recharts.github.io/en-US/examples/SimpleLineChart/ A line chart with customized active dot}
   */
  activeDot?: ActiveDotType;
  /**
   * @defaultValue true
   */
  animateNewValues?: boolean;
  /**
   * Specifies when the animation should begin, the unit of this option is ms.
   * @defaultValue 0
   */
  animationBegin?: number;
  /**
   * Specifies the duration of animation, the unit of this option is ms.
   * @defaultValue 1500
   */
  animationDuration?: AnimationDuration;
  /**
   * The type of easing function.
   * @defaultValue ease
   */
  animationEasing?: AnimationTiming;
  className?: string;
  /**
   * Whether to connect the line across null points.
   * @defaultValue false
   *
   * @see {@link https://recharts.github.io/en-US/examples/LineChartConnectNulls/ LineChart with connectNull true and false}
   */
  connectNulls?: boolean;
  /**
   * Renders a circle element at each data point. Options:
   *
   * - `false`: no dots are drawn;
   * - `true`: renders the dots with default settings;
   * - `object`: the props of the dot. This will be merged with the internal calculated props of each dot;
   * - `ReactElement`: the custom dot element;
   * - `function`: a render function of the custom dot.
   *
   * @defaultValue true
   *
   * @example <Line dataKey="value" dot={false} />
   * @example <Line dataKey="value" dot={{ stroke: 'red', strokeWidth: 2 }} />
   * @example <Line dataKey="value" dot={CustomizedDot} />
   *
   * @see {@link https://recharts.github.io/en-US/examples/CustomizedDotLineChart/ A line chart with customized dot}
   */
  dot?: DotType;
  /**
   * Hides the whole graphical element when true.
   *
   * Hiding an element is different from removing it from the chart:
   * Hidden graphical elements are still visible in Legend,
   * and can be included in axis domain calculations,
   * depending on `includeHidden` props of your XAxis/YAxis.
   *
   * @defaultValue false
   */
  hide?: boolean;

  /**
   * Unique identifier of this component.
   * Used as an HTML attribute `id`, and also to identify this element internally.
   *
   * If undefined, Recharts will generate a unique ID automatically.
   */
  id?: string;
  /**
   * If set false, animation of line will be disabled.
   * If set "auto", the animation will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
   * @defaultValue auto
   */
  isAnimationActive?: boolean | 'auto';

  /**
   * Renders one label for each data point. Options:
   * - `true`: renders default labels;
   * - `false`: no labels are rendered;
   * - `object`: the props of LabelList component;
   * - `ReactElement`: a custom label element;
   * - `function`: a render function of custom label.
   *
   * @defaultValue false
   * @example <Line dataKey="value" label />
   * @example <Line dataKey="value" label={{ fill: 'red', fontSize: 20 }} />
   * @example <Line dataKey="value" label={CustomizedLabel} />
   *
   * @see {@link https://recharts.github.io/en-US/examples/CustomizedLabelLineChart/ A line chart with customized label}
   */
  label?: ImplicitLabelListType;
  /**
   * The type of icon in legend.
   * If set to 'none', no legend item will be rendered.
   * @defaultValue line
   */
  legendType?: LegendType;
  /**
   * If set a ReactElement, the shape of line can be customized.
   * If set a function, the function will be called to render customized shape.
   *
   * @example <Line dataKey="value" shape={CustomizedShapeComponent} />
   * @example <Line dataKey="value" shape={renderShapeFunction} />
   */
  shape?: ActiveShape<CurveProps, SVGPathElement>;

  /**
   * The name of data.
   * This option will be used in tooltip and legend to represent this graphical item.
   * If no value was set to this option, the value of dataKey will be used alternatively.
   */
  name?: string | number;
  /**
   * The customized event handler of animation end
   */
  onAnimationEnd?: () => void;
  /**
   * The customized event handler of animation start
   */
  onAnimationStart?: () => void;
  tooltipType?: TooltipType;
  /**
   * The interpolation type of curve. Allows custom interpolation function.
   *
   * @defaultValue linear
   * @link https://d3js.org/d3-shape/curve
   * @see {@link https://recharts.github.io/en-US/examples/CardinalAreaChart/ An AreaChart which has two area with different interpolation.}
   */
  type?: CurveType;
  /**
   * The unit of data. This option will be used in tooltip.
   */
  unit?: string | number | null;
  /**
   * The id of XAxis which is corresponding to the data. Required when there are multiple XAxes.
   * @defaultValue 0
   */
  xAxisId?: AxisId;
  /**
   * The id of YAxis which is corresponding to the data. Required when there are multiple YAxes.
   * @defaultValue 0
   */
  yAxisId?: AxisId;
  /**
   * Z-Index of this component and its children. The higher the value,
   * the more on top it will be rendered.
   * Components with higher zIndex will appear in front of components with lower zIndex.
   * If undefined or 0, the content is rendered in the default layer without portals.
   *
   * @since 3.4
   * @defaultValue 400
   * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
   */
  zIndex?: number;
  /**
   * The stroke color. If `"none"`, no line will be drawn.
   *
   * @defaultValue #3182bd
   */
  stroke?: string;
  /**
   * The width of the stroke
   *
   * @defaultValue 1
   */
  strokeWidth?: string | number;
  /**
   * The pattern of dashes and gaps used to paint the line
   *
   * @example <Line strokeDasharray="4" />
   * @example <Line strokeDasharray="4 1" />
   * @example <Line strokeDasharray="4 1 2" />
   */
  strokeDasharray?: string | number;
}
/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */
type LineSvgProps = Omit<CurveProps, 'points' | 'pathRef' | 'ref' | 'layout' | 'baseLine'>;
type InternalProps = LineSvgProps & InternalLineProps;
export type Props<DataPointType = any, ValueAxisType = any> = LineSvgProps & LineProps<DataPointType, ValueAxisType>;
export const computeLegendPayloadFromAreaData = (props: Props): ReadonlyArray<LegendPayload> => {
  const { dataKey, name, stroke, legendType, hide } = props;
  return [
    {
      inactive: hide,
      dataKey,
      type: legendType,
      color: stroke,
      value: getTooltipNameProp(name, dataKey),
      payload: props,
    },
  ];
};
/**
 * Generates a simple stroke-dasharray string for animating a line draw effect.
 *
 * Uses `totalLength` as the gap (instead of `totalLength - length`) to prevent a floating-point
 * precision artifact: when fractional dash and gap values are serialized to a string attribute
 * and re-parsed by the SVG renderer, their sum can differ from the actual path length by a ULP,
 * causing the dasharray pattern to repeat and render a phantom dot at the path endpoint
 * with round or square strokeLinecap.
 *
 * @param totalLength The total length of the SVG path
 * @param length The currently visible portion of the path
 * @returns A stroke-dasharray string like "50px 200px"
 */
export const generateSimpleStrokeDasharray = (totalLength: number, length: number): string => {
  return `${length}px ${totalLength}px`;
};
/**
 * Repeats a dash pattern array a given number of times.
 *
 * If the input array has an odd length, a trailing `0` is appended to make it even
 * before repeating, because SVG stroke-dasharray patterns must have an even number
 * of values to cycle correctly between dash and gap segments.
 *
 * @param lines Array of dash/gap lengths to repeat
 * @param count Number of times to repeat the pattern
 * @returns A new array with the pattern repeated `count` times
 */
function repeat(lines: number[], count: number): number[] {
  const linesUnit = lines.length % 2 !== 0 ? [...lines, 0] : lines;
  const result: number[] = [];
  for (let i = 0; i < count; ++i) {
    result.push(...linesUnit);
  }
  return result;
}
/**
 * Computes a stroke-dasharray string for animating a custom-dashed line draw effect.
 *
 * Given a user-specified dash pattern (e.g. `"7,3"`), this function builds a dasharray
 * that reveals exactly `length` pixels of that pattern, followed by a gap of `totalLength`
 * to hide the remainder of the path.
 *
 * Like {@link generateSimpleStrokeDasharray}, the trailing gap uses `totalLength` rather than
 * `totalLength - length` to avoid floating-point precision artifacts with round/square strokeLinecap.
 *
 * @param length The currently visible portion of the path
 * @param totalLength The total length of the SVG path
 * @param lines The user-specified dash pattern as an array of numbers (e.g. [7, 3])
 * @returns A stroke-dasharray string incorporating the custom dash pattern
 */
export const getStrokeDasharray = (length: number, totalLength: number, lines: number[]): string => {
  const lineLength = lines.reduce((pre, next) => pre + next, 0);

  // if lineLength is 0 return the default when no strokeDasharray is provided
  if (!lineLength) {
    return generateSimpleStrokeDasharray(totalLength, length);
  }

  const count = Math.floor(length / lineLength);
  const remainLength = length % lineLength;
  let remainLines: number[] = [];
  for (let i = 0, sum = 0; i < lines.length; sum += lines[i] ?? 0, ++i) {
    const lineValue = lines[i];
    if (lineValue != null && sum + lineValue > remainLength) {
      remainLines = [...lines.slice(0, i), remainLength - sum];
      break;
    }
  }

  const emptyLines = remainLines.length % 2 === 0 ? [0, totalLength] : [totalLength];

  return [...repeat(lines, count), ...remainLines, ...emptyLines].map(line => `${line}px`).join(', ');
};
export function getTotalLength(mainCurve: SVGPathElement | null): number {
  try {
    return (mainCurve && mainCurve.getTotalLength && mainCurve.getTotalLength()) || 0;
  } catch {
    return 0;
  }
}
export const errorBarDataPointFormatter: ErrorBarDataPointFormatter<LinePointItem> = (
  dataPoint: LinePointItem,
  dataKey,
): ErrorBarDataItem => {
  return {
    x: dataPoint.x ?? undefined,
    y: dataPoint.y ?? undefined,
    value: dataPoint.value,
    // getValueByDataKey does not validate the output type
    errorVal: getValueByDataKey(dataPoint.payload, dataKey),
  };
};
export const defaultLineProps = {
  activeDot: true,
  animateNewValues: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  connectNulls: false,
  dot: true,
  fill: '#fff',
  hide: false,
  isAnimationActive: 'auto',
  label: false,
  legendType: 'line',
  stroke: '#3182bd',
  strokeWidth: 1,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: DefaultZIndexes.line,
  type: 'linear',
} as const satisfies Partial<Props>;
export function computeLinePoints({
  layout,
  xAxis,
  yAxis,
  xAxisTicks,
  yAxisTicks,
  dataKey,
  bandSize,
  displayedData,
}: {
  layout: CartesianLayout;
  xAxis: BaseAxisWithScale;
  yAxis: BaseAxisWithScale;
  xAxisTicks: TickItem[];
  yAxisTicks: TickItem[];
  dataKey: Props['dataKey'];
  bandSize: number;
  displayedData: ChartData;
}): ReadonlyArray<LinePointItem> {
  return displayedData
    .map((entry, index): LinePointItem | null => {
      // getValueByDataKey does not validate the output type
      const value: number = getValueByDataKey(entry, dataKey);

      if (layout === 'horizontal') {
        const x = getCateCoordinateOfLine({ axis: xAxis, ticks: xAxisTicks, bandSize, entry, index });
        const y = isNullish(value) ? null : yAxis.scale.map(value);
        return {
          x,
          y: y ?? null,
          value,
          payload: entry,
        };
      }

      const x = isNullish(value) ? null : xAxis.scale.map(value);
      const y = getCateCoordinateOfLine({ axis: yAxis, ticks: yAxisTicks, bandSize, entry, index });
      if (x == null || y == null) {
        return null;
      }
      return {
        x,
        y,
        value,
        payload: entry,
      };
    })
    .filter(Boolean);
}
