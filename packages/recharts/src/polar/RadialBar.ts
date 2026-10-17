import * as React from '../react.js';
import { ReactElement } from '../react.js';
import { Series } from 'victory-vendor/d3-shape';
import { RadialBarSectorProps } from '../util/RadialBarUtils.js';
import { Props as SectorProps } from '../shape/Sector.js';
import { ImplicitLabelListType } from '../component/LabelList.js';
import { mathSign } from '../util/DataUtils.js';
import { BarPositionPosition, getCateCoordinateOfBar, getValueByDataKey, truncateByDomain } from '../util/ChartUtils.js';
import { ActiveShape, AnimationDuration, AnimationTiming, DataConsumer, DataKey, LayoutType, LegendType, PolarViewBoxRequired, PresentationAttributesAdaptChildEvent, TickItem, TooltipType } from '../util/types.js';
import { TooltipTriggerInfo } from '../context/tooltipContext.js';
import { BaseAxisWithScale } from '../state/selectors/axisSelectors.js';
import { ChartData } from '../state/chartDataSlice.js';
import { AxisId } from '../state/cartesianAxisSlice.js';
import { RequiresDefaultProps } from '../util/resolveDefaultProps.js';
import { WithIdRequired } from '../util/useUniqueId.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
export const STABLE_EMPTY_ARRAY: readonly RadialBarDataItem[] = [];
export type RadialBarDataItem = SectorProps &
  PolarViewBoxRequired &
  TooltipTriggerInfo & {
    value?: any;
    payload?: any;
    background?: SectorProps;
  };
type RadialBarBackground = boolean | (ActiveShape<SectorProps> & ZIndexable);
type RadialBarSectorsProps = {
  sectors: ReadonlyArray<RadialBarDataItem>;
  allOtherRadialBarProps: InternalProps;
  showLabels: boolean;
};
interface InternalRadialBarProps<DataPointType = any, DataValueType = any>
  extends DataConsumer<DataPointType, DataValueType>, ZIndexable {
  activeShape?: ActiveShape<RadialBarSectorProps, SVGPathElement>;
  /**
   * @defaultValue 0
   */
  angleAxisId?: AxisId;
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
  /**
   * Renders a background for each bar. Options:
   *  - `false`: no background;
   *  - `true`: renders default background;
   *  - `object`: the props of background rectangle;
   *  - `ReactElement`: a custom background element;
   *  - `function`: a render function of custom background.
   *
   * @defaultValue false
   */
  background?: RadialBarBackground;
  /**
   * The width or height of each bar. If the barSize is not specified, the size of the bar will be calculated by the barCategoryGap, barGap and the quantity of bar groups.
   */
  barSize?: number;
  className?: string;
  /**
   * @defaultValue false
   */
  cornerIsExternal?: boolean;
  /**
   * @defaultValue 0
   */
  cornerRadius?: string | number;
  /**
   * Calculated radial bar sectors
   */
  sectors: ReadonlyArray<RadialBarDataItem>;
  /**
   * @defaultValue false
   */
  forceCornerRadius?: boolean;
  /**
   * @defaultValue false
   */
  hide?: boolean;
  /**
   * If set false, animation of radial bars will be disabled.
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
   */
  label?: ImplicitLabelListType;
  /**
   * The type of icon in legend.  If set to 'none', no legend item will be rendered.
   * @defaultValue rect
   */
  legendType?: LegendType;
  maxBarSize?: number;
  /**
   * @defaultValue 0
   */
  minPointSize?: number;
  /**
   * The customized event handler of animation end
   */
  onAnimationEnd?: () => void;
  /**
   * The customized event handler of animation start
   */
  onAnimationStart?: () => void;
  /**
   * The customized event handler of click in this chart.
   */
  onClick?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mousedown in this chart.
   */
  onMouseDown?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mouseup in this chart.
   */
  onMouseUp?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mousemove in this chart.
   */
  onMouseMove?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mouseover in this chart.
   */
  onMouseOver?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mouseout in this chart.
   */
  onMouseOut?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mouseenter in this chart.
   */
  onMouseEnter?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mouseleave in this chart.
   */
  onMouseLeave?: (data: RadialBarDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  onTouchStart?: (data: RadialBarDataItem, index: number, e: React.TouchEvent<SVGGraphicsElement>) => void;
  onTouchMove?: (data: RadialBarDataItem, index: number, e: React.TouchEvent<SVGGraphicsElement>) => void;
  onTouchEnd?: (data: RadialBarDataItem, index: number, e: React.TouchEvent<SVGGraphicsElement>) => void;
  /**
   * @defaultValue 0
   */
  radiusAxisId?: AxisId;
  shape?: ActiveShape<RadialBarSectorProps, SVGPathElement>;
  stackId?: string | number;
  tooltipType?: TooltipType;
  /**
   * @defaultValue 300
   */
  zIndex?: number;
}
export type RadialBarProps<DataPointType = any, DataValueType = any> = Omit<
  PresentationAttributesAdaptChildEvent<RadialBarDataItem, SVGElement>,
  'ref' | keyof InternalRadialBarProps<DataPointType, DataValueType>
> &
  Omit<InternalRadialBarProps<DataPointType, DataValueType>, 'sectors'>;
export type InternalProps = WithIdRequired<PropsWithDefaults> & Pick<InternalRadialBarProps, 'sectors'>;
export const defaultRadialBarProps = {
  angleAxisId: 0,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  background: false,
  cornerIsExternal: false,
  cornerRadius: 0,
  forceCornerRadius: false,
  hide: false,
  isAnimationActive: 'auto',
  label: false,
  legendType: 'rect',
  minPointSize: 0,
  radiusAxisId: 0,
  zIndex: DefaultZIndexes.bar,
} as const satisfies Partial<RadialBarProps>;
type PropsWithDefaults<DataPointType = any, DataValueType = any> = RequiresDefaultProps<
  RadialBarProps<DataPointType, DataValueType>,
  typeof defaultRadialBarProps
>;
export function computeRadialBarDataItems({
  displayedData,
  stackedData,
  dataStartIndex,
  stackedDomain,
  dataKey,
  baseValue,
  layout,
  radiusAxis,
  radiusAxisTicks,
  bandSize,
  pos,
  angleAxis,
  minPointSize,
  cx,
  cy,
  angleAxisTicks,
  cells,
  startAngle: rootStartAngle,
  endAngle: rootEndAngle,
}: {
  displayedData: ChartData;
  stackedData: Series<Record<number, number>, DataKey<any>> | undefined;
  dataStartIndex: number;
  stackedDomain: ReadonlyArray<unknown> | null;
  dataKey: DataKey<any> | undefined;
  baseValue: number | unknown;
  layout: LayoutType;
  radiusAxis: BaseAxisWithScale;
  radiusAxisTicks: ReadonlyArray<TickItem> | undefined;
  bandSize: number;
  pos: BarPositionPosition;
  angleAxis: BaseAxisWithScale;
  minPointSize: number;
  cx: number;
  cy: number;
  angleAxisTicks: ReadonlyArray<TickItem> | undefined;
  cells: ReadonlyArray<ReactElement> | undefined;
  startAngle: number;
  endAngle: number;
}): ReadonlyArray<RadialBarDataItem> {
  if (angleAxisTicks == null || radiusAxisTicks == null) {
    return STABLE_EMPTY_ARRAY;
  }

  return (displayedData ?? []).map((entry: unknown, index: number) => {
    let value,
      innerRadius: number | null | undefined,
      outerRadius: number | undefined,
      startAngle: number | null,
      endAngle: number,
      backgroundSector;

    if (stackedData) {
      // @ts-expect-error truncateByDomain expects only numerical domain, but it can received categorical domain too
      value = truncateByDomain(stackedData[dataStartIndex + index], stackedDomain);
    } else {
      value = getValueByDataKey(entry, dataKey);
      if (!Array.isArray(value)) {
        value = [baseValue, value];
      }
    }

    if (layout === 'radial') {
      startAngle = angleAxis.scale.map(value[0]) ?? rootStartAngle;
      endAngle = angleAxis.scale.map(value[1]) ?? rootEndAngle;
      innerRadius = getCateCoordinateOfBar({
        axis: radiusAxis,
        ticks: radiusAxisTicks,
        bandSize,
        offset: pos.offset,
        entry,
        index,
      });
      if (innerRadius != null && endAngle != null && startAngle != null) {
        outerRadius = innerRadius + pos.size;
        const deltaAngle = endAngle - startAngle;

        if (Math.abs(minPointSize) > 0 && Math.abs(deltaAngle) < Math.abs(minPointSize)) {
          const delta = mathSign(deltaAngle || minPointSize) * (Math.abs(minPointSize) - Math.abs(deltaAngle));

          endAngle += delta;
        }
        backgroundSector = {
          background: {
            cx,
            cy,
            innerRadius,
            outerRadius,
            startAngle: rootStartAngle,
            endAngle: rootEndAngle,
          },
        };
      }
    } else {
      innerRadius = radiusAxis.scale.map(value[0]);
      outerRadius = radiusAxis.scale.map(value[1]);
      startAngle = getCateCoordinateOfBar({
        axis: angleAxis,
        ticks: angleAxisTicks,
        bandSize,
        offset: pos.offset,
        entry,
        index,
      });
      if (innerRadius != null && outerRadius != null && startAngle != null) {
        endAngle = startAngle + pos.size;
        const deltaRadius = outerRadius - innerRadius;

        if (Math.abs(minPointSize) > 0 && Math.abs(deltaRadius) < Math.abs(minPointSize)) {
          const delta = mathSign(deltaRadius || minPointSize) * (Math.abs(minPointSize) - Math.abs(deltaRadius));
          outerRadius += delta;
        }
      }
    }

    return {
      // @ts-expect-error can't spread unknown
      ...entry,
      ...backgroundSector,
      payload: entry,
      value: stackedData ? value : value[1],
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      // @ts-expect-error endAngle is used before assigned (?)
      endAngle,
      ...(cells && cells[index] && cells[index].props),
    } satisfies RadialBarDataItem;
  });
}
