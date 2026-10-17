import { MouseEvent, ReactElement, SVGProps } from '../react.js';
import last from 'es-toolkit/compat/last';
import { interpolate, isNullish } from '../util/DataUtils.js';
import { polarToCartesian } from '../util/PolarUtils.js';
import { getTooltipNameProp, getValueByDataKey } from '../util/ChartUtils.js';
import { ImplicitLabelListType } from '../component/LabelList.js';
import { ActiveDotType, AnimationDuration, AnimationTiming, DataConsumer, DataKey, DotType, LegendType, TooltipType } from '../util/types.js';
import type { LegendPayload } from '../component/DefaultLegendContent.js';
import { RequiresDefaultProps } from '../util/resolveDefaultProps.js';
import { WithIdRequired } from '../util/useUniqueId.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
import { RechartsScale } from '../util/scale/RechartsScale.js';
export interface RadarPoint {
  x: number;
  y: number;
  cx?: number;
  cy?: number;
  angle: number;
  radius?: number;
  value?: number;
  payload?: any;
  name?: string | number;
}
interface RadarProps<DataPointType = any, DataValueType = any>
  extends ZIndexable, DataConsumer<DataPointType, DataValueType> {
  /**
   * @defaultValue true
   */
  activeDot?: ActiveDotType;
  /**
   * @defaultValue 0
   */
  angleAxisId?: string | number;
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
  baseLinePoints?: RadarPoint[];
  className?: string;
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
   * @defaultValue false
   */
  hide?: boolean;
  /**
   * If set false, animation of polygon will be disabled.
   * If set "auto", the animation will be disabled in SSR and will respect the user's prefers-reduced-motion system preference for accessibility.
   * @defaultValue auto
   */
  isAnimationActive?: boolean | 'auto';
  isRange?: boolean;
  /**
   * Renders one label for each point. Options:
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
  /**
   * The customized event handler of animation end
   */
  onAnimationEnd?: () => void;
  /**
   * The customized event handler of animation start
   */
  onAnimationStart?: () => void;
  onMouseEnter?: (props: InternalRadarProps, e: MouseEvent<SVGPolygonElement>) => void;
  onMouseLeave?: (props: InternalRadarProps, e: MouseEvent<SVGPolygonElement>) => void;
  /**
   * @defaultValue 0
   */
  radiusAxisId?: string | number;

  /**
   * If set a ReactElement, the shape of radar can be customized.
   * If set a function, the function will be called to render customized shape.
   */
  shape?: ReactElement<SVGElement> | ((props: any) => ReactElement<SVGElement>);
  tooltipType?: TooltipType;
  /**
   * @defaultValue 100
   */
  zIndex?: number;
}
export type RadiusAxisForRadar = { scale: RechartsScale };
export type AngleAxisForRadar = {
  scale: RechartsScale;
  type: 'number' | 'category';
  dataKey: DataKey<any> | undefined;
  cx: number;
  cy: number;
};
export type Props<DataPointType = any, DataValueType = any> = Omit<
  SVGProps<SVGGraphicsElement>,
  'onMouseEnter' | 'onMouseLeave' | 'points' | 'ref'
> &
  RadarProps<DataPointType, DataValueType>;
export type RadarComposedData = {
  points: RadarPoint[];
  baseLinePoints: RadarPoint[];
  isRange: boolean;
};
export function getLegendItemColor(stroke: string | undefined, fill: string | undefined): string | undefined {
  return stroke && stroke !== 'none' ? stroke : fill;
}
export const computeLegendPayloadFromRadarSectors = (props: PropsWithDefaults): ReadonlyArray<LegendPayload> => {
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
export function computeRadarPoints({
  radiusAxis,
  angleAxis,
  displayedData,
  dataKey,
  bandSize,
}: {
  radiusAxis: RadiusAxisForRadar;
  angleAxis: AngleAxisForRadar;
  displayedData: any[];
  dataKey: RadarProps['dataKey'];
  bandSize: number;
}): RadarComposedData {
  const { cx, cy } = angleAxis;
  let isRange = false;
  const points: RadarPoint[] = [];
  const angleBandSize = angleAxis.type !== 'number' ? (bandSize ?? 0) : 0;

  displayedData.forEach((entry, i) => {
    const name = getValueByDataKey(entry, angleAxis.dataKey, i);
    const value = getValueByDataKey(entry, dataKey);
    const angle: number = (angleAxis.scale.map(name) ?? 0) + angleBandSize;
    const pointValue = Array.isArray(value) ? last(value) : value;
    const radius: number = isNullish(pointValue) ? 0 : (radiusAxis.scale.map(pointValue) ?? 0);

    if (Array.isArray(value) && value.length >= 2) {
      isRange = true;
    }

    points.push({
      ...polarToCartesian(cx, cy, radius, angle),
      // getValueByDataKey does not validate the output type
      name,
      // getValueByDataKey does not validate the output type
      value,
      cx,
      cy,
      radius,
      angle,
      payload: entry,
    });
  });
  const baseLinePoints: RadarPoint[] = [];

  if (isRange) {
    points.forEach((point: RadarPoint) => {
      if (Array.isArray(point.value)) {
        const baseValue = point.value[0];
        const radius: number = isNullish(baseValue) ? 0 : (radiusAxis.scale.map(baseValue) ?? 0);

        baseLinePoints.push({
          ...point,
          radius,
          ...polarToCartesian(cx, cy, radius, point.angle),
        });
      } else {
        baseLinePoints.push(point);
      }
    });
  }

  return { points, isRange, baseLinePoints };
}
export const interpolatePolarPoint =
  (prevPoints: ReadonlyArray<RadarPoint> | undefined, prevPointsDiffFactor: number, t: number) =>
  (entry: RadarPoint, index: number) => {
    const prev = prevPoints && prevPoints[Math.floor(index * prevPointsDiffFactor)];

    if (prev) {
      return {
        ...entry,
        x: interpolate(prev.x, entry.x, t),
        y: interpolate(prev.y, entry.y, t),
      };
    }

    return {
      ...entry,
      x: interpolate(entry.cx, entry.x, t),
      y: interpolate(entry.cy, entry.y, t),
    };
  };
export const defaultRadarProps = {
  activeDot: true,
  angleAxisId: 0,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  dot: false,
  hide: false,
  isAnimationActive: 'auto',
  label: false,
  legendType: 'rect',
  radiusAxisId: 0,
  zIndex: DefaultZIndexes.area,
} as const satisfies Partial<Props>;
type PropsWithDefaults = RequiresDefaultProps<Props, typeof defaultRadarProps>;
export type InternalRadarProps = WithIdRequired<PropsWithDefaults> & RadarComposedData;
