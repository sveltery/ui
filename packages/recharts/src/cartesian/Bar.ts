import * as React from '../react.js';
import { Key, ReactElement, ReactNode } from '../react.js';
import { Series } from 'victory-vendor/d3-shape';
import { Props as RectangleProps, RectRadius } from '../shape/Rectangle.js';
import { ErrorBarDataItem, ErrorBarDataPointFormatter } from './ErrorBar.js';
import { ImplicitLabelListType } from '../component/LabelList.js';
import { isNan, mathSign } from '../util/DataUtils.js';
import { BarPositionPosition, getBaseValueOfBar, getCateCoordinateOfBar, getTooltipNameProp, getValueByDataKey, StackId, truncateByDomain } from '../util/ChartUtils.js';
import { ActiveShape, AnimationDuration, CartesianViewBoxRequired, ChartOffsetInternal, Coordinate, DataConsumer, DataKey, LegendType, PresentationAttributesAdaptChildEvent, TickItem, TooltipType } from '../util/types.js';
import { MinPointSize, minPointSizeCallback } from '../util/BarUtils.js';
import type { LegendPayload } from '../component/DefaultLegendContent.js';
import { BaseAxisWithScale } from '../state/selectors/axisSelectors.js';
import { BarSettings } from '../state/types/BarSettings.js';
import { EasingInput } from '../animation/easing.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
import { AxisId } from '../state/cartesianAxisSlice.js';
import { GraphicalItemId } from '../state/graphicalItemsSlice.js';
import { ChartData } from '../state/chartDataSlice.js';
type BarRectangleType = {
  x: number | null;
  y: number | null;
  width: number;
  height: number;
};
export interface BarRectangleItem extends RectangleProps {
  value: number | [number, number];
  /** the coordinate of background rectangle */
  background?: BarRectangleType;
  tooltipPosition: Coordinate;
  readonly payload?: any;
  parentViewBox: CartesianViewBoxRequired;
  // These are inherited from RectangleProps, but we need to redefine them here and make non-nullable
  x: number;
  y: number;
  width: number;
  height: number;
  /**
   * Chart range coordinate of the baseValue of the first bar in a stack.
   */
  stackedBarStart: number;
  /**
   * Stable pre-filter index within the currently displayed data slice.
   * Used for matching with activeIndex from tooltip and for BarStack clip-path indexing.
   */
  originalDataIndex: number;
}
export type BarShapeProps = BarRectangleItem & {
  isActive: boolean;
  index: number;
  option?: ActiveShape<BarShapeProps, SVGPathElement> | undefined;
};
interface BarProps<DataPointType, ValueAxisType> extends DataConsumer<DataPointType, ValueAxisType>, ZIndexable {
  className?: string;
  index?: Key;
  /**
   * The id of XAxis which is corresponding to the data. Required when there are multiple XAxes.
   *
   * @defaultValue 0
   */
  xAxisId?: AxisId;
  /**
   * The id of YAxis which is corresponding to the data. Required when there are multiple YAxes.
   *
   * @defaultValue 0
   */
  yAxisId?: AxisId;
  /**
   * When two Bars have the same axisId and same stackId, then the two Bars are stacked in the chart.
   *
   * @see {@link https://recharts.github.io/en-US/examples/StackedBarChart/ Stacked bar chart example}
   * @see {@link https://recharts.github.io/en-US/examples/MixBarChart/ Chart with both stacked and non-stacked bars}
   * @see {@link BarStack}
   */
  stackId?: StackId;
  /**
   * The width or height of each bar. If the barSize is not specified, the size of bar will be calculated by the barCategoryGap, barGap and the quantity of bar groups.
   */
  barSize?: string | number;
  /**
   * The unit of data. This option will be used in tooltip.
   */
  unit?: string | number;
  /**
   * The name of data.
   * This option will be used in tooltip and legend to represent a bar.
   * If no value was set to this option, the value of dataKey will be used alternatively.
   */
  name?: string | number;
  tooltipType?: TooltipType;
  /**
   * The type of icon in legend. If set to 'none', no legend item will be rendered.
   *
   * @defaultValue rect
   */
  legendType?: LegendType;
  /**
   * The minimal height of a bar in a horizontal chart, or the minimal width of a bar in a vertical chart.
   *
   * By default, 0 values are not shown.
   * To visualize a 0 (or close to zero) point, set the minimal point size to a pixel value like 3.
   *
   * In stacked bar charts, minPointSize might not be respected for tightly packed values.
   * So we strongly recommend not using this props in stacked BarChart.
   *
   * You may provide a function to conditionally change this prop based on Bar value.
   *
   * @defaultValue 0
   *
   * @see {@link https://recharts.github.io/en-US/examples/BarChartWithMinHeight/ Chart with min bar height}
   */
  minPointSize?: MinPointSize;
  /**
   * The maximum width of bar in a horizontal chart, or maximum height in a vertical chart.
   */
  maxBarSize?: number;
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
   * If set a ReactElement, the shape of bar can be customized.
   * If set a function, the function will be called to render customized shape.
   * By default, renders a rectangle.
   *
   * @see {@link https://recharts.github.io/en-US/examples/CustomShapeBarChart/ Custom shape bar chart example}
   */
  shape?: ActiveShape<BarShapeProps, SVGPathElement>;

  /**
   * The active bar is shown when a user enters a bar chart and this chart has tooltip. Options:
   * - `false`: all bars are passive, nothing happens on mouse events;
   * - `true`: active bar is rendered separately but the default props are the same as others: so mouse events do not change its appearance. className and zIndex are different though;
   * - `object`: the props of active bar;
   * - `function`: the render function of active bar;
   * - `ReactElement`: the active bar element.
   *
   * @defaultValue false
   *
   * @see {@link https://recharts.github.io/en-US/examples/SimpleBarChart/ activeBar example}
   *
   * @example <Bar activeBar={{ fill: 'red' }} />
   * @example <Bar activeBar={CustomActiveBarFn} />
   */
  activeBar?: ActiveShape<BarShapeProps, SVGPathElement>;
  /**
   * Renders a background for each bar. Options:
   *  - `false`: no background;
   *  - `true`: renders default background;
   *  - `object`: the props of background rectangle;
   *  - `ReactElement`: a custom background element;
   *  - `function`: a render function of custom background.
   *
   * @defaultValue false
   *
   * @see {@link https://recharts.github.io/en-US/examples/BarChartHasBackground/ BarChart with background example}
   */
  background?: ActiveShape<BarShapeProps, SVGPathElement> & ZIndexable;
  /**
   * The radius of corners.
   *
   * If you provide a single number, it applies to all four corners.
   * If you provide an array of four numbers, they apply to top-left, top-right, bottom-right, bottom-left corners respectively.
   *
   * @see {@link https://recharts.github.io/en-US/guide/roundedBars/ Guide: Rounded bar corners}
   */
  radius?: RectRadius;
  /**
   * The customized event handler of animation start
   */
  onAnimationStart?: () => void;
  /**
   * The customized event handler of animation end
   */
  onAnimationEnd?: () => void;

  /**
   * If set false, animation of bar will be disabled.
   * If set "auto", the animation will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
   *
   * @defaultValue auto
   */
  isAnimationActive?: boolean | 'auto';
  /**
   * Specifies when the animation should begin, the unit of this option is ms.
   * @defaultValue 0
   */
  animationBegin?: number;
  /**
   * Specifies the duration of animation, the unit of this option is ms.
   *
   * @defaultValue 400
   */
  animationDuration?: AnimationDuration;
  /**
   * The type of easing function.
   *
   * @defaultValue 'ease'
   */
  animationEasing?: EasingInput;
  /**
   * The unique identifier of this component.
   * Used as an HTML attribute `id`, and also to identify this element internally.
   *
   * If undefined, Recharts will generate a unique ID automatically.
   */
  id?: string;
  /**
   * Renders one label for each bar. Options:
   * - `true`: renders default labels;
   * - `false`: no labels are rendered;
   * - `object`: the props of LabelList component;
   * - `ReactElement`: a custom label element;
   * - `function`: a render function of custom label.
   *
   * @defaultValue false
   *
   * @example <Bar label />
   * @example <Bar label={{ position: 'top', fontSize: 20 }} />
   * @example <Bar label={CustomizedLabelFn} />
   */
  label?: ImplicitLabelListType;
  /**
   * Z-Index of this component and its children. The higher the value,
   * the more on top it will be rendered.
   * Components with higher zIndex will appear in front of components with lower zIndex.
   * If undefined or 0, the content is rendered in the default layer without portals.
   *
   * @since 3.4
   * @defaultValue 300
   * @see {@link https://recharts.github.io/en-US/guide/zIndex/ Z-Index and layers guide}
   */
  zIndex?: number;
}
type BarMouseEvent = (
  data: BarRectangleItem,
  index: number,
  event: React.MouseEvent<SVGPathElement, MouseEvent>,
) => void;
interface BarEvents {
  /**
   * The customized event handler of click on the bars in this group
   *
   * @see {@link https://recharts.github.io/en-US/examples/BarChartWithCustomizedEvent/ Chart with customized event example}
   */
  onClick: BarMouseEvent;
  /**
   * The customized event handler of mouseenter on the bars in this group
   */
  onMouseEnter: BarMouseEvent;
  /**
   * The customized event handler of mouseleave on the bars in this group
   */
  onMouseLeave: BarMouseEvent;
  /**
   * The customized event handler of mousemove on the bars in this group
   */
  onMouseMove: BarMouseEvent;
  /**
   * The customized event handler of mousedown on the bars in this group
   */
  onMouseDown: BarMouseEvent;
  /**
   * The customized event handler of mouseup on the bars in this group
   */
  onMouseUp: BarMouseEvent;
  /**
   * The customized event handler of mouseover on the bars in this group
   */
  onMouseOver: BarMouseEvent;
  /**
   * The customized event handler of mouseout on the bars in this group
   */
  onMouseOut: BarMouseEvent;
}
type InternalBarProps = {
  /*
   * Injected from Redux store
   */
  layout: 'horizontal' | 'vertical';
  data: ReadonlyArray<BarRectangleItem> | undefined;

  /*
   * Provided by user, has defaults
   */
  xAxisId: string | number;
  yAxisId: string | number;
  hide: boolean;
  legendType: LegendType;
  minPointSize: MinPointSize;
  activeBar: ActiveShape<BarShapeProps, SVGPathElement>;
  isAnimationActive: boolean | 'auto';
  animationBegin: number;
  animationDuration: AnimationDuration;
  animationEasing: EasingInput;

  /*
   * Provided by user
   */
  needClip?: boolean;
  className?: string;
  index?: Key;
  stackId?: string | number;
  barSize?: string | number;
  unit?: string | number;
  name?: string | number;
  dataKey?: DataKey<any>;
  tooltipType?: TooltipType;
  maxBarSize?: number;
  shape?: ActiveShape<BarShapeProps, SVGPathElement>;
  background?: ActiveShape<BarShapeProps, SVGPathElement>;
  radius?: number | [number, number, number, number];

  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;

  /**
   * Internally, ID is required, either from outside or autogenerated.
   */
  id: GraphicalItemId;
  label?: ImplicitLabelListType;
};
type BarSvgProps = Omit<
  PresentationAttributesAdaptChildEvent<BarRectangleItem, SVGPathElement>,
  'radius' | 'name' | 'ref'
>;
export type Props<DataPointType = any, ValueAxisType = any> = Partial<BarEvents> &
  BarProps<DataPointType, ValueAxisType> &
  Omit<BarSvgProps, keyof BarEvents>;
export type InternalProps = BarSvgProps & InternalBarProps;
export const computeLegendPayloadFromBarData = (props: Props): ReadonlyArray<LegendPayload> => {
  const { dataKey, name, fill, legendType, hide } = props;
  return [
    {
      inactive: hide,
      dataKey,
      type: legendType,
      color: fill,
      value: getTooltipNameProp(name, dataKey),
      payload: props,
    },
  ];
};
type BarBackgroundProps = {
  background?: ActiveShape<BarShapeProps, SVGPathElement>;
  data: ReadonlyArray<BarRectangleItem> | undefined;
  dataKey: DataKey<any> | undefined;
  allOtherBarProps: InternalProps;
};
type BarRectanglesProps = InternalProps & {
  data: ReadonlyArray<BarRectangleItem> | undefined;
};
const defaultMinPointSize: number = 0;
export const errorBarDataPointFormatter: ErrorBarDataPointFormatter<BarRectangleItem> = (
  dataPoint: BarRectangleItem,
  dataKey,
): ErrorBarDataItem => {
  /**
   * if the value coming from `selectBarRectangles` is an array then this is a stacked bar chart.
   * arr[1] represents end value of the bar since the data is in the form of [startValue, endValue].
   * */
  const value = Array.isArray(dataPoint.value) ? dataPoint.value[1] : dataPoint.value;
  return {
    x: dataPoint.x,
    y: dataPoint.y,
    value,
    // getValueByDataKey does not validate the output type
    errorVal: getValueByDataKey(dataPoint, dataKey),
  };
};
export const defaultBarProps = {
  activeBar: false,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: 'ease',
  background: false,
  hide: false,
  isAnimationActive: 'auto',
  label: false,
  legendType: 'rect',
  minPointSize: defaultMinPointSize,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: DefaultZIndexes.bar,
} as const satisfies Partial<Props>;
export type BarImplProps = Omit<InternalBarProps, 'layout' | 'data'> & { children?: ReactNode };
export function computeBarRectangles({
  layout,
  barSettings: { dataKey, minPointSize: minPointSizeProp, hasCustomShape },
  pos,
  bandSize,
  xAxis,
  yAxis,
  xAxisTicks,
  yAxisTicks,
  stackedData,
  displayedData,
  offset,
  cells,
  parentViewBox,
  dataStartIndex,
}: {
  layout: 'horizontal' | 'vertical';
  barSettings: BarSettings;
  pos: BarPositionPosition;
  bandSize: number;
  xAxis: BaseAxisWithScale;
  yAxis: BaseAxisWithScale;
  xAxisTicks: TickItem[];
  yAxisTicks: TickItem[];
  stackedData: Series<Record<number, number>, DataKey<any>> | undefined;
  offset: ChartOffsetInternal;
  displayedData: ChartData;
  cells: ReadonlyArray<ReactElement> | undefined;
  parentViewBox: CartesianViewBoxRequired;
  dataStartIndex: number;
}): ReadonlyArray<BarRectangleItem> | undefined {
  const numericAxis = layout === 'horizontal' ? yAxis : xAxis;
  // @ts-expect-error this assumes that the domain is always numeric, but doesn't check for it
  const stackedDomain: ReadonlyArray<number> = stackedData ? numericAxis.scale.domain() : null;
  const baseValue = getBaseValueOfBar({ numericAxis });
  const stackedBarStart: number | undefined = numericAxis.scale.map(baseValue);

  return displayedData
    .map((entry: unknown, index): BarRectangleItem | null => {
      let value, x: number | null, y, width, height, background: BarRectangleType;

      if (stackedData) {
        // Use dataStartIndex to access the correct element in the full stackedData array
        const untruncatedValue = stackedData[index + dataStartIndex];
        if (untruncatedValue == null) {
          return null;
        }
        value = truncateByDomain(untruncatedValue, stackedDomain);
      } else {
        value = getValueByDataKey(entry, dataKey);

        if (!Array.isArray(value)) {
          value = [baseValue, value];
        }
      }

      const minPointSize = minPointSizeCallback(minPointSizeProp, defaultMinPointSize)(value[1], index);

      if (layout === 'horizontal') {
        const baseValueScale = yAxis.scale.map(value[0]);
        const currentValueScale = yAxis.scale.map(value[1]);
        if (baseValueScale == null || currentValueScale == null) {
          return null;
        }
        x = getCateCoordinateOfBar({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          offset: pos.offset,
          entry,
          index,
        });
        y = currentValueScale ?? baseValueScale ?? undefined;
        width = pos.size;
        const computedHeight = baseValueScale - currentValueScale;
        height = isNan(computedHeight) ? 0 : computedHeight;
        background = { x, y: offset.top, width, height: offset.height };

        if (Math.abs(minPointSize) > 0 && Math.abs(height) < Math.abs(minPointSize)) {
          const delta = mathSign(height || minPointSize) * (Math.abs(minPointSize) - Math.abs(height));

          y -= delta;
          height += delta;
        }
      } else {
        const baseValueScale = xAxis.scale.map(value[0]);
        const currentValueScale = xAxis.scale.map(value[1]);
        if (baseValueScale == null || currentValueScale == null) {
          return null;
        }
        x = baseValueScale;
        y = getCateCoordinateOfBar({
          axis: yAxis,
          ticks: yAxisTicks,
          bandSize,
          offset: pos.offset,
          entry,
          index,
        });
        width = currentValueScale - baseValueScale;
        height = pos.size;
        background = { x: offset.left, y, width: offset.width, height };

        if (Math.abs(minPointSize) > 0 && Math.abs(width) < Math.abs(minPointSize)) {
          const delta = mathSign(width || minPointSize) * (Math.abs(minPointSize) - Math.abs(width));
          width += delta;
        }
      }

      /*
       * Filter out 0-dimension rectangles early to avoid creating unnecessary component trees.
       * BarStack clip-paths use originalDataIndex, so sparse filtered arrays remain index-stable.
       * Bars with a custom shape are not filtered out: the custom renderer may still draw something
       * visible at zero-dimension positions (e.g. horizontal lines in a BoxPlot).
       */
      if (
        x == null ||
        y == null ||
        width == null ||
        height == null ||
        (!hasCustomShape && (width === 0 || height === 0))
      ) {
        return null;
      }

      const barRectangleItem: BarRectangleItem = {
        // @ts-expect-error spread of unknown type
        ...entry,
        stackedBarStart,
        x,
        y,
        width,
        height,
        value: stackedData ? value : value[1],
        payload: entry,
        background,
        tooltipPosition: { x: x + width / 2, y: y + height / 2 },
        parentViewBox,
        originalDataIndex: index,
        ...(cells && cells[index] && cells[index].props),
      } satisfies BarRectangleItem;

      return barRectangleItem;
    })
    .filter(Boolean);
}
