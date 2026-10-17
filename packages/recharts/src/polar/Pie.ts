import * as React from '../react.js';
import { ReactElement, ReactNode, SVGProps } from '../react.js';
import { getMaxRadius, polarToCartesian } from '../util/PolarUtils.js';
import { getPercentValue, isNumber, mathSign } from '../util/DataUtils.js';
import { getValueByDataKey } from '../util/ChartUtils.js';
import { ActiveShape, AnimationDuration, AnimationTiming, ChartOffsetInternal, Coordinate, DataConsumer, DataKey, DataProvider, GeometrySector, LegendType, PresentationAttributesAdaptChildEvent, TooltipType } from '../util/types.js';
import { TooltipTriggerInfo } from '../context/tooltipContext.js';
import { TooltipPayload } from '../state/tooltipSlice.js';
import { RequiresDefaultProps } from '../util/resolveDefaultProps.js';
import { PiePresentationProps, PieSettings } from '../state/types/PieSettings.js';
import { SVGPropsNoEvents } from '../util/svgPropertiesNoEvents.js';
import { Props as LabelListProps } from '../component/LabelList.js';
import { GraphicalItemId } from '../state/graphicalItemsSlice.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
import { ChartData } from '../state/chartDataSlice.js';
interface PieDef {
  /**
   * The x-coordinate of center. If set a percentage, the final value is obtained by multiplying the percentage of container width.
   */
  cx?: number | string;
  /**
   * The y-coordinate of center. If set a percentage, the final value is obtained by multiplying the percentage of container height.
   */
  cy?: number | string;
  /**
   * Angle in degrees from which the chart should start.
   */
  startAngle?: number;
  /**
   * Angle, in degrees, at which the chart should end.
   */
  endAngle?: number;
  /**
   * The angle between two sectors.
   *
   * @example <Pie paddingAngle={5} />
   * @example https://recharts.github.io/examples/PieChartWithPaddingAngle
   */
  paddingAngle?: number;
  /**
   * The inner radius of the sectors.
   * If set a percentage, the final value is obtained by multiplying the percentage of maxRadius which is calculated by the width, height, cx, cy.
   */
  innerRadius?: number | string;
  /**
   * The outer radius of the sectors.
   * If set a percentage, the final value is obtained by multiplying the percentage of maxRadius which is calculated by the width, height, cx, cy.
   * Function should return a string percentage or number.
   */
  outerRadius?: number | string | ((dataPoint: any) => number | string);
  cornerRadius?: number | string;
}
type PieLabelLine =
  | ReactElement<SVGElement>
  | ((props: any) => ReactElement<SVGElement>)
  | SVGProps<SVGPathElement>
  | boolean;
interface PieLabelExtraProps {
  stroke: string;
  index: number;
  textAnchor: string;
}
export type PieLabelRenderProps = Omit<SVGPropsNoEvents<PieSvgAttributes>, 'offset'> &
  Omit<PieSectorDataItem, 'offset'> &
  PieLabelExtraProps &
  Coordinate;
export type LabelListPropsWithPosition = LabelListProps & { position: LabelListProps['position'] };
/**
 * The `label` prop in Pie accepts a variety of alternatives.
 */
export type PieLabel =
  /*
   * If label prop is false, labels don't show.
   * If label prop is true, labels will be rendered with default props.
   */
  | boolean
  /*
   * If label prop is an object, and it contains a `position` prop,
   * the object will become props to a <LabelList /> component.
   */
  | LabelListPropsWithPosition
  /*
   * If label prop is an object, and it does not have a `position` prop,
   * this renders a special Pie label that is similar to <Label position="outside"> and supports an optional labelLine.
   * labelLine is a small line connecting the sector to the label.
   */
  | Partial<PieLabelRenderProps>
  /*
   * If label prop is a function, or a React component, it will be called once for each label.
   * The result of each call will be rendered.
   */
  | ((props: PieLabelRenderProps) => ReactNode | ReactElement<SVGElement>)
  /*
   * If label prop is a ReactElement, it will get cloned and receive brand-new surprise props.
   * I do not recommend this variant
   */
  | ReactElement<SVGElement>;
export type PieSectorData = GeometrySector &
  TooltipTriggerInfo & {
    dataKey?: DataKey<any>;
    midAngle?: number;
    middleRadius?: number;
    name?: string | number;
    paddingAngle?: number;
    payload?: any;
    percent?: number;
    value: number;
  };
/**
 * We spread the data object into the sector data item,
 * so we can't really know what is going to be inside.
 *
 * This type represents our best effort, but it all depends on the input data
 * and what is inside of it.
 *
 * https://github.com/recharts/recharts/issues/6380
 * https://github.com/recharts/recharts/discussions/6375
 */
export type PieSectorDataItem = PiePresentationProps &
  PieCoordinate &
  PieSectorData & {
    cornerRadius: number | undefined;
  };
export type PieSectorShapeProps = PieSectorDataItem & { isActive: boolean; index: number };
export type PieShape = ReactNode | ((props: PieSectorShapeProps, index: number) => React.ReactElement);
interface PieEvents {
  /**
   * The customized event handler of click on the sectors in this group.
   */
  onClick?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mousedown on the sectors in this group.
   */
  onMouseDown?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mouseup on the sectors in this group.
   */
  onMouseUp?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mousemove on the sectors in this group.
   */
  onMouseMove?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mouseover on the sectors in this group.
   */
  onMouseOver?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mouseout on the sectors in this group.
   */
  onMouseOut?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mouseenter on the sectors in this group.
   */
  onMouseEnter?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  /**
   * The customized event handler of mouseleave on the sectors in this group.
   */
  onMouseLeave?: (data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => void;
  onTouchStart?: (data: PieSectorDataItem, index: number, e: React.TouchEvent<SVGGraphicsElement>) => void;
  onTouchMove?: (data: PieSectorDataItem, index: number, e: React.TouchEvent<SVGGraphicsElement>) => void;
  onTouchEnd?: (data: PieSectorDataItem, index: number, e: React.TouchEvent<SVGGraphicsElement>) => void;
}
/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */
interface InternalPieProps<DataPointType = unknown> extends DataProvider<DataPointType>, PieDef, ZIndexable, PieEvents {
  id: GraphicalItemId;
  className?: string;
  // We actually spread the whole PieSectorDataItem into the keys.
  dataKey: DataKey<DataPointType, unknown>;
  // We actually spread the whole PieSectorDataItem into the keys.
  nameKey?: DataKey<DataPointType, string>;
  /** The minimum angle for no-zero element */
  minAngle?: number;
  legendType?: LegendType;
  tooltipType?: TooltipType;
  /** the max radius of pie */
  maxRadius?: number;
  hide?: boolean;
  sectors: ReadonlyArray<PieSectorDataItem>;
  /** @deprecated */
  activeShape?: ActiveShape<PieSectorDataItem>;
  /** @deprecated */
  inactiveShape?: ActiveShape<PieSectorDataItem>;
  shape?: PieShape;
  labelLine?: PieLabelLine;
  label?: PieLabel;
  animationEasing?: AnimationTiming;
  isAnimationActive?: boolean | 'auto';
  animationBegin?: number;
  animationDuration?: AnimationDuration;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  rootTabIndex?: number;
}
interface PieProps<DataPointType = any, DataValueType = any>
  extends DataProvider<DataPointType>, DataConsumer<DataPointType, DataValueType>, PieDef, PieEvents, ZIndexable {
  /**
   * This component is rendered when this graphical item is activated
   * (could be by mouse hover, touch, keyboard, programmatically).
   *
   * @deprecated Use the `shape` prop to create each sector. `isActive` designates the "active" shape.
   * @example <Pie activeShape={<CustomActiveShape />} />
   * @example https://recharts.github.io/examples/CustomActiveShapePieChart
   */
  activeShape?: ActiveShape<PieSectorDataItem>;
  /**
   * Specifies when the animation should begin, the unit of this option is ms.
   * @defaultValue 400
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
  id?: string;
  /**
   * The shape of inactive sector.
   * @deprecated Use the `shape` prop to modify each sector.
   */
  inactiveShape?: ActiveShape<PieSectorDataItem>;
  /**
   * If set false, animation will be disabled.
   * If set "auto", the animation will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
   * @defaultValue auto
   */
  isAnimationActive?: boolean | 'auto';
  /**
   * Renders one label for each pie sector. Options:
   * - `true`: renders default labels;
   * - `false`: no labels are rendered;
   * - `object` that has `position` prop: the props of LabelList component;
   * - `object` that does not have `position` prop: the props of a custom Pie label (similar to Label with position "outside"); this variant supports `labelLine`
   * - `ReactElement`: a custom label element;
   * - `function`: a render function of custom label.
   *
   * Also see the `labelLine` prop that draws a line connecting each label to the corresponding sector.
   *
   * @defaultValue false
   * @example <Pie label={<CustomizedLabel />} />
   * @example https://recharts.github.io/examples/PieChartWithCustomizedLabel
   */
  label?: PieLabel;
  /**
   * If false set, label lines will not be drawn. If true set, label lines will be drawn which have the props calculated internally.
   * If object set, label lines will be drawn which have the props merged by the internal calculated props and the option.
   * If ReactElement set, the option can be the custom label line element.
   * If set a function, the function will be called to render customized label line.
   * @defaultValue true
   * @example <Pie labelLine={<CustomizedLabelLine />} />
   * @example https://recharts.github.io/examples/PieChartWithCustomizedLabel
   */
  labelLine?: PieLabelLine;
  /**
   * The type of icon in legend. If set to 'none', no legend item will be rendered.
   * @defaultValue rect
   */
  legendType?: LegendType;
  /** the max radius of pie */
  maxRadius?: number;
  /**
   * The minimum angle of each unzero data.
   * @defaultValue 0
   */
  minAngle?: number;
  /**
   * Name represents each sector in the tooltip, and legend.
   * This allows you to extract the name from the data:
   *
   * - `string`: the name of the field in the data object;
   * - `number`: the index of the field in the data;
   * - `function`: a function that receives the data object and returns the name.
   *
   * @defaultValue name
   */
  nameKey?: DataKey<DataPointType, DataValueType>;
  /**
   * The customized event handler of animation end.
   */
  onAnimationEnd?: () => void;
  /**
   * The customized event handler of animation start.
   */
  onAnimationStart?: () => void;
  /**
   * The tabindex of wrapper surrounding the cells.
   * @defaultValue 0
   */
  rootTabIndex?: number;
  /**
   * The custom shape of a Pie Sector.
   * Can also be used to render active sector by checking isActive.
   * If undefined, renders {@link Sector} shape.
   */
  shape?: PieShape;
  tooltipType?: TooltipType;
  /**
   * @defaultValue 100
   */
  zIndex?: number;
}
type PieSvgAttributes = Omit<PresentationAttributesAdaptChildEvent<any, SVGElement>, 'ref' | keyof PieEvents>;
type InternalProps = PieSvgAttributes & InternalPieProps;
export type Props<DataPointType = any, DataValueType = any> = PieSvgAttributes & PieProps<DataPointType, DataValueType>;
type RealPieData = Record<string, unknown>;
export type PieCoordinate = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  maxRadius: number;
};
type PieSectorsProps = {
  sectors: Readonly<PieSectorDataItem[]>;
  /**
   * @deprecated
   */
  activeShape: ActiveShape<Readonly<PieSectorDataItem>> | undefined;
  /**
   * @deprecated
   */
  inactiveShape: ActiveShape<Readonly<PieSectorDataItem>> | undefined;
  shape: PieShape;
  allOtherPieProps: WithoutId<InternalProps>;
  id: GraphicalItemId;
};
const getOuterRadius = (
  dataPoint: any,
  outerRadius: number | string | ((element: any) => number | string),
  maxPieRadius: number,
) => {
  if (typeof outerRadius === 'function') {
    return getPercentValue(outerRadius(dataPoint), maxPieRadius, maxPieRadius * 0.8);
  }
  return getPercentValue(outerRadius, maxPieRadius, maxPieRadius * 0.8);
};
const parseCoordinateOfPie = (pieSettings: PieSettings, offset: ChartOffsetInternal, dataPoint: any): PieCoordinate => {
  const { top, left, width, height } = offset;
  const maxPieRadius = getMaxRadius(width, height);
  const cx = left + getPercentValue(pieSettings.cx, width, width / 2);
  const cy = top + getPercentValue(pieSettings.cy, height, height / 2);
  const innerRadius = getPercentValue(pieSettings.innerRadius, maxPieRadius, 0);

  const outerRadius = getOuterRadius(dataPoint, pieSettings.outerRadius, maxPieRadius);

  const maxRadius = pieSettings.maxRadius || Math.sqrt(width * width + height * height) / 2;

  return { cx, cy, innerRadius, outerRadius, maxRadius };
};
const parseDeltaAngle = (startAngle: number, endAngle: number) => {
  const sign = mathSign(endAngle - startAngle);
  const deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);

  return sign * deltaAngle;
};
export function computePieSectors({
  pieSettings,
  displayedData,
  cells,
  offset,
}: {
  pieSettings: PieSettings;
  displayedData: ChartData;
  cells: ReadonlyArray<ReactElement> | undefined;
  offset: ChartOffsetInternal;
}): ReadonlyArray<PieSectorDataItem> | undefined {
  const { cornerRadius, startAngle, endAngle, dataKey, nameKey, tooltipType } = pieSettings;
  const minAngle = Math.abs(pieSettings.minAngle);
  const deltaAngle = parseDeltaAngle(startAngle, endAngle);
  const absDeltaAngle = Math.abs(deltaAngle);
  const paddingAngle = displayedData.length <= 1 ? 0 : (pieSettings.paddingAngle ?? 0);

  const notZeroItemCount = displayedData.filter(entry => getValueByDataKey(entry, dataKey, 0) !== 0).length;
  const totalPaddingAngle = (absDeltaAngle >= 360 ? notZeroItemCount : notZeroItemCount - 1) * paddingAngle;
  const realTotalAngle = absDeltaAngle - notZeroItemCount * minAngle - totalPaddingAngle;

  const sum = displayedData.reduce((result: number, entry: any) => {
    const val = getValueByDataKey(entry, dataKey, 0);
    return result + (isNumber(val) ? val : 0);
  }, 0);
  let sectors;

  if (sum > 0) {
    let prev: PieSectorDataItem;
    sectors = displayedData.map((entry: unknown, i: number) => {
      const val: number = getValueByDataKey(entry, dataKey, 0);
      const name: string = getValueByDataKey(entry, nameKey, i);
      const coordinate: PieCoordinate = parseCoordinateOfPie(pieSettings, offset, entry);
      const percent = (isNumber(val) ? val : 0) / sum;
      let tempStartAngle;

      // @ts-expect-error can't spread unknown
      const entryWithCellInfo: RealPieData = { ...entry, ...(cells && cells[i] && cells[i].props) };
      const sectorColor =
        entryWithCellInfo != null && 'fill' in entryWithCellInfo && typeof entryWithCellInfo.fill === 'string'
          ? entryWithCellInfo.fill
          : pieSettings.fill;

      if (i) {
        tempStartAngle = prev.endAngle + mathSign(deltaAngle) * paddingAngle * (val !== 0 ? 1 : 0);
      } else {
        tempStartAngle = startAngle;
      }

      const tempEndAngle =
        tempStartAngle + mathSign(deltaAngle) * ((val !== 0 ? minAngle : 0) + percent * realTotalAngle);
      const midAngle = (tempStartAngle + tempEndAngle) / 2;
      const middleRadius = (coordinate.innerRadius + coordinate.outerRadius) / 2;

      const tooltipPayload: TooltipPayload = [
        {
          name,
          value: val,
          payload: entryWithCellInfo,
          dataKey,
          type: tooltipType,
          color: sectorColor,
          fill: sectorColor,
          graphicalItemId: pieSettings.id,
        },
      ];
      const tooltipPosition = polarToCartesian(coordinate.cx, coordinate.cy, middleRadius, midAngle);

      prev = {
        ...pieSettings.presentationProps,
        percent,
        cornerRadius: typeof cornerRadius === 'string' ? parseFloat(cornerRadius) : cornerRadius,
        name,
        tooltipPayload,
        midAngle,
        middleRadius,
        tooltipPosition,
        ...entryWithCellInfo,
        ...coordinate,
        value: val,
        dataKey,
        startAngle: tempStartAngle,
        endAngle: tempEndAngle,
        payload: entryWithCellInfo,
        paddingAngle: mathSign(deltaAngle) * paddingAngle,
      };
      return prev;
    });
  }
  return sectors;
}
type WithoutId<T> = Omit<T, 'id'>;
export const defaultPieProps = {
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: 'ease',
  cx: '50%',
  cy: '50%',
  dataKey: 'value',
  endAngle: 360,
  fill: '#808080',
  hide: false,
  innerRadius: 0,
  isAnimationActive: 'auto',
  label: false,
  labelLine: true,
  legendType: 'rect',
  minAngle: 0,
  nameKey: 'name',
  outerRadius: '80%',
  paddingAngle: 0,
  rootTabIndex: 0,
  startAngle: 0,
  stroke: '#fff',
  zIndex: DefaultZIndexes.area,
} as const satisfies Partial<Props>;
type PropsWithResolvedDefaults = RequiresDefaultProps<Props, typeof defaultPieProps>;
