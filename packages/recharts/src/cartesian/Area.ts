import { BaseLineType, CurveType, Props as CurveProps } from '../shape/Curve.js';
import { ImplicitLabelListType } from '../component/LabelList.js';
import { isNumber } from '../util/DataUtils.js';
import { getCateCoordinateOfLine, getTooltipNameProp, getValueByDataKey, StackId } from '../util/ChartUtils.js';
import { ActiveDotType, AnimationDuration, AnimationTiming, CartesianLayout, DataConsumer, DataKey, DataProvider, DotType, LegendType, NullableCoordinate, TickItem, TooltipType } from '../util/types.js';
import type { LegendPayload } from '../component/DefaultLegendContent.js';
import { BaseAxisWithScale } from '../state/selectors/axisSelectors.js';
import { ChartData } from '../state/chartDataSlice.js';
import { AreaPointItem, ComputedArea } from '../state/selectors/areaSelectors.js';
import { RequiresDefaultProps } from '../util/resolveDefaultProps.js';
import { WithIdRequired } from '../util/useUniqueId.js';
import { AreaSettings } from '../state/types/AreaSettings.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
import { AxisId } from '../state/cartesianAxisSlice.js';
import { StackDataPoint } from '../util/stacks/stackTypes.js';
/**
 * @inline
 */
export type BaseValue = number | 'dataMin' | 'dataMax';
/**
 * Our base value array has payload in it, and we expose it externally too.
 */
type BaseValueCoordinate<DataPointType = any> = NullableCoordinate & { payload: DataPointType | undefined };
/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */
interface InternalAreaProps extends ZIndexable {
  activeDot: ActiveDotType;
  animationBegin: number;
  animationDuration: AnimationDuration;
  animationEasing: AnimationTiming;
  baseLine: BaseLineType | undefined;

  baseValue?: BaseValue;
  className?: string;
  connectNulls: boolean;
  data?: ChartData;
  dataKey: DataKey<any>;
  dot: DotType;
  height: number;
  hide: boolean;

  /**
   * ID is mandatory internally, but optional externally.
   */
  id: string;
  isAnimationActive: boolean | 'auto';
  isRange?: boolean;
  label?: ImplicitLabelListType;
  layout: CartesianLayout;
  left: number;

  legendType: LegendType;
  name?: string | number;
  needClip: boolean;
  onAnimationEnd?: () => void;
  onAnimationStart?: () => void;

  points: ReadonlyArray<AreaPointItem>;
  stackId?: StackId;

  tooltipType?: TooltipType;
  top: number;
  type?: CurveType;
  unit?: string | number;
  width: number;
  xAxisId: string | number;
  yAxisId: string | number;
}
/**
 * External props, intended for end users to fill in
 */
interface AreaProps<DataPointType = any, DataValueType = any>
  extends DataProvider<DataPointType>, Required<DataConsumer<DataPointType, DataValueType>>, ZIndexable {
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
   * @example <Area dataKey="value" activeDot={false} />
   * @example <Area dataKey="value" activeDot={{ stroke: 'red', strokeWidth: 2, r: 10 }} />
   * @example <Area dataKey="value" activeDot={CustomizedActiveDot} />
   *
   * @see {@link https://recharts.github.io/en-US/examples/SimpleLineChart/ A line chart with customized active dot}
   */
  activeDot?: ActiveDotType;
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
   * @defaultValue 'ease'
   */
  animationEasing?: AnimationTiming;
  /**
   * Baseline of the area:
   * - number: uses the corresponding axis value as a flat baseline;
   * - an array of coordinates: describes a custom baseline path.
   */
  baseLine?: BaseLineType;
  baseValue?: BaseValue;
  className?: string;

  /**
   * Whether to connect the area across null points.
   *
   * @defaultValue false
   * @see {@link https://recharts.github.io/en-US/examples/AreaChartConnectNulls/ AreaChart with connectNull true and false}
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
   * @defaultValue false
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
   * If set false, animation of area will be disabled.
   * If set "auto", will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
   * @defaultValue 'auto'
   */
  isAnimationActive?: boolean | 'auto';
  isRange?: boolean;
  /**
   * Renders one label for each data point. Options:
   *
   * - `true`: renders default labels
   * - `false`: no labels are rendered
   * - `object`: the props of LabelList component
   * - `ReactElement`: a custom label element
   * - `function`: a render function of custom label
   *
   * @defaultValue false
   */
  label?: ImplicitLabelListType;
  /**
   * The type of icon in legend.
   * If set to 'none', no legend item will be rendered.
   * @defaultValue 'line'
   */
  legendType?: LegendType;

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
  /**
   * When two Areas have the same axisId and same stackId, then the two Areas are stacked in the chart.
   */
  stackId?: StackId;
  /**
   * The stroke color. If "none", no line will be drawn.
   * @defaultValue '#3182bd'
   */
  stroke?: string;
  /**
   * The width of the stroke
   * @defaultValue 1
   */
  strokeWidth?: string | number;
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
  unit?: string | number;
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
   * @defaultValue 100
   * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
   */
  zIndex?: number;
}
/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */
type AreaSvgProps = Omit<
  CurveProps,
  'points' | 'ref' | 'layout' | 'path' | 'pathRef' | 'baseLine' | 'dangerouslySetInnerHTML'
>;
type InternalProps = AreaSvgProps & InternalAreaProps;
export type Props<DataPointType, ValueAxisType> = AreaSvgProps & AreaProps<DataPointType, ValueAxisType>;
type PropsWithDefaults<DataPointType, ValueAxisType> = WithIdRequired<
  RequiresDefaultProps<Props<DataPointType, ValueAxisType>, typeof defaultAreaProps>
>;
export function getLegendItemColor(stroke: string | undefined, fill: string | undefined): string | undefined {
  return stroke && stroke !== 'none' ? stroke : fill;
}
export const computeLegendPayloadFromAreaData = <DataPointType, ValueAxisType>(
  props: Props<DataPointType, ValueAxisType>,
): ReadonlyArray<LegendPayload> => {
  const { dataKey, name, stroke, fill, legendType, hide } = props;
  return [
    {
      inactive: hide,
      dataKey,
      type: legendType,
      color: getLegendItemColor(stroke, fill),
      value: getTooltipNameProp(name, dataKey),
      payload: props,
    },
  ];
};
export const defaultAreaProps = {
  activeDot: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  connectNulls: false,
  dot: false,
  fill: '#3182bd',
  fillOpacity: 0.6,
  hide: false,
  isAnimationActive: 'auto',
  legendType: 'line',
  stroke: '#3182bd',
  strokeWidth: 1,
  type: 'linear',
  label: false,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: DefaultZIndexes.area,
} as const satisfies Partial<Props<never, never>>;
export const getBaseValue = (
  layout: 'horizontal' | 'vertical',
  chartBaseValue: BaseValue | undefined,
  itemBaseValue: BaseValue | undefined,
  xAxis: BaseAxisWithScale,
  yAxis: BaseAxisWithScale,
): number => {
  // The baseValue can be defined both on the AreaChart, and on the Area.
  // The value for the item takes precedence.
  const baseValue: BaseValue | undefined = itemBaseValue ?? chartBaseValue;

  if (isNumber(baseValue)) {
    return baseValue;
  }

  const numericAxis = layout === 'horizontal' ? yAxis : xAxis;
  // @ts-expect-error d3scale .domain() returns unknown, Math.max expects number
  const domain: [number, number] = numericAxis.scale.domain();

  if (numericAxis.type === 'number') {
    const domainMax = Math.max(domain[0], domain[1]);
    const domainMin = Math.min(domain[0], domain[1]);

    if (baseValue === 'dataMin') {
      return domainMin;
    }
    if (baseValue === 'dataMax') {
      return domainMax;
    }

    return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
  }

  if (baseValue === 'dataMin') {
    return domain[0];
  }
  if (baseValue === 'dataMax') {
    return domain[1];
  }

  return domain[0];
};
export function computeArea({
  areaSettings: { connectNulls, baseValue: itemBaseValue, dataKey },
  stackedData,
  layout,
  chartBaseValue,
  xAxis,
  yAxis,
  displayedData,
  dataStartIndex,
  xAxisTicks,
  yAxisTicks,
  bandSize,
}: {
  areaSettings: AreaSettings;
  stackedData: ReadonlyArray<StackDataPoint> | undefined;
  layout: 'horizontal' | 'vertical';
  chartBaseValue: BaseValue | undefined;
  xAxis: BaseAxisWithScale;
  yAxis: BaseAxisWithScale;
  displayedData: ChartData;
  dataStartIndex: number;
  xAxisTicks: TickItem[];
  yAxisTicks: TickItem[];
  bandSize: number;
}): ComputedArea {
  const hasStack = stackedData && stackedData.length;
  const baseValue = getBaseValue(layout, chartBaseValue, itemBaseValue, xAxis, yAxis);
  const isHorizontalLayout = layout === 'horizontal';
  let isRange = false;

  const points: ReadonlyArray<AreaPointItem> = displayedData.map((entry, index): AreaPointItem => {
    let valueAsArray: ReadonlyArray<unknown> | undefined;

    if (hasStack) {
      valueAsArray = stackedData[dataStartIndex + index];
    } else {
      const rawValue = getValueByDataKey(entry, dataKey);

      if (!Array.isArray(rawValue)) {
        valueAsArray = [baseValue, rawValue];
      } else {
        valueAsArray = rawValue;
        isRange = true;
      }
    }

    const value1 = valueAsArray?.[1] ?? null;

    const isBreakPoint = value1 == null || (hasStack && !connectNulls && getValueByDataKey(entry, dataKey) == null);

    if (isHorizontalLayout) {
      return {
        x: getCateCoordinateOfLine({ axis: xAxis, ticks: xAxisTicks, bandSize, entry, index }),
        y: isBreakPoint ? null : (yAxis.scale.map(value1) ?? null),
        value: valueAsArray,
        payload: entry,
      };
    }

    return {
      x: isBreakPoint ? null : (xAxis.scale.map(value1) ?? null),
      y: getCateCoordinateOfLine({ axis: yAxis, ticks: yAxisTicks, bandSize, entry, index }),
      value: valueAsArray,
      payload: entry,
    };
  });

  let baseLine: number | NullableCoordinate[] | undefined;
  if (hasStack || isRange) {
    baseLine = points.map((entry: AreaPointItem): BaseValueCoordinate => {
      const x = Array.isArray(entry.value) ? entry.value[0] : null;
      if (isHorizontalLayout) {
        return {
          x: entry.x,
          y: x != null && entry.y != null ? (yAxis.scale.map(x) ?? null) : null,
          payload: entry.payload,
        };
      }
      return {
        x: x != null ? (xAxis.scale.map(x) ?? null) : null,
        y: entry.y,
        payload: entry.payload,
      };
    });
  } else {
    baseLine = isHorizontalLayout ? yAxis.scale.map(baseValue) : xAxis.scale.map(baseValue);
  }

  return {
    points,
    baseLine: baseLine ?? 0,
    isRange,
  };
}
