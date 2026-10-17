import * as React from '../react.js';
import { SVGProps } from '../react.js';
import { Props as TextProps, TextAnchor, TextVerticalAnchor } from '../component/Text.js';
import { ImplicitLabelType } from '../component/Label.js';
import { isNumber } from '../util/DataUtils.js';
import { CartesianViewBox, PresentationAttributesAdaptChildEvent, CartesianTickItem, AxisInterval, Coordinate, RectangleCoordinate, TickProp } from '../util/types.js';
import { AxisId, XAxisOrientation, XAxisPadding, YAxisOrientation, YAxisPadding } from '../state/cartesianAxisSlice.js';
import { RequiresDefaultProps } from '../util/resolveDefaultProps.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
/** The orientation of the axis in correspondence to the chart */
export type Orientation = XAxisOrientation | YAxisOrientation;
/** A unit to be appended to a value */
export type Unit = string | number;
/** The formatter function of tick */
export type TickFormatter = (value: any, index: number) => string;
export interface CartesianAxisProps extends ZIndexable {
  className?: string;
  axisType?: 'xAxis' | 'yAxis';
  axisId?: AxisId;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  unit?: Unit;
  orientation?: Orientation;
  // The viewBox of svg
  viewBox?: CartesianViewBox;
  tick?: TickProp<unknown>;
  /**
   * Additional props to spread to each tick Text element.
   * Optional, the CartesianAxis component will provide its own defaults calculated from other props.
   */
  tickTextProps?: TextProps;
  axisLine?: boolean | SVGProps<SVGLineElement>;
  tickLine?: boolean | SVGProps<SVGLineElement>;
  mirror?: boolean;
  tickMargin?: number;
  hide?: boolean;
  label?: ImplicitLabelType;
  /** Padding information passed to custom tick components */
  padding?: XAxisPadding | YAxisPadding;

  minTickGap?: number;
  /**
   * Careful - this is the same name as XAxis + YAxis `ticks` but completely different object!
   */
  ticks?: ReadonlyArray<CartesianTickItem>;
  tickSize?: number;
  tickFormatter?: TickFormatter;
  interval?: AxisInterval;
  /** Angle in which ticks will be rendered. */
  angle?: number;
  /**
   * CartesianAxis reads scale internally and this prop is ignored since 3.0
   * @deprecated
   */
  scale?: unknown;
  labelRef?: React.RefObject<SVGTextElement> | null;

  ref?: React.Ref<CartesianAxisRef>;
}
export interface CartesianAxisRef {
  getCalculatedWidth(): number;
}
export const defaultCartesianAxisProps = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  viewBox: { x: 0, y: 0, width: 0, height: 0 },
  // The orientation of axis
  orientation: 'bottom',
  // The ticks
  ticks: [] as CartesianAxisProps['ticks'],

  stroke: '#666',
  tickLine: true,
  axisLine: true,
  tick: true,
  mirror: false,

  minTickGap: 5,
  // The width or height of tick
  tickSize: 6,
  tickMargin: 2,
  interval: 'preserveEnd',
  zIndex: DefaultZIndexes.axis,
} as const satisfies Partial<Props>;
/*
 * `viewBox` and `scale` are SVG attributes.
 * Recharts however - unfortunately - has its own attributes named `viewBox` and `scale`
 * that are completely different data shape and different purpose.
 */
export type Props = Omit<PresentationAttributesAdaptChildEvent<any, SVGElement>, 'viewBox' | 'scale' | 'ref'> &
  CartesianAxisProps;
type InternalProps = RequiresDefaultProps<Props, typeof defaultCartesianAxisProps>;
/**
 * Calculate the coordinates of endpoints in ticks.
 * @param data The data of a simple tick.
 * @param x The x-coordinate of the axis.
 * @param y The y-coordinate of the axis.
 * @param width The width of the axis.
 * @param height The height of the axis.
 * @param orientation The orientation of the axis.
 * @param tickSize The length of the tick line.
 * @param mirror If true, the ticks are mirrored.
 * @param tickMargin The margin between the tick line and the tick text.
 * @returns An object with `line` and `tick` coordinates.
 * `line` is the coordinates for the tick line, and `tick` is the coordinate for the tick text.
 */
export function getTickLineCoord(
  data: CartesianTickItem,
  x: number,
  y: number,
  width: number,
  height: number,
  orientation: Orientation,
  tickSize: number,
  mirror: boolean,
  tickMargin: number,
): {
  line: RectangleCoordinate;
  tick: Coordinate;
} {
  let x1, x2, y1, y2, tx, ty;

  const sign = mirror ? -1 : 1;
  const finalTickSize = data.tickSize || tickSize;
  const tickCoord = isNumber(data.tickCoord) ? data.tickCoord : data.coordinate;

  switch (orientation) {
    case 'top':
      x1 = x2 = data.coordinate;
      y2 = y + +!mirror * height;
      y1 = y2 - sign * finalTickSize;
      ty = y1 - sign * tickMargin;
      tx = tickCoord;
      break;
    case 'left':
      y1 = y2 = data.coordinate;
      x2 = x + +!mirror * width;
      x1 = x2 - sign * finalTickSize;
      tx = x1 - sign * tickMargin;
      ty = tickCoord;
      break;
    case 'right':
      y1 = y2 = data.coordinate;
      x2 = x + +mirror * width;
      x1 = x2 + sign * finalTickSize;
      tx = x1 + sign * tickMargin;
      ty = tickCoord;
      break;
    default:
      x1 = x2 = data.coordinate;
      y2 = y + +mirror * height;
      y1 = y2 + sign * finalTickSize;
      ty = y1 + sign * tickMargin;
      tx = tickCoord;
      break;
  }

  return { line: { x1, y1, x2, y2 }, tick: { x: tx, y: ty } };
}
/**
 * @param orientation The orientation of the axis.
 * @param mirror If true, the ticks are mirrored.
 * @returns The text anchor of the tick.
 */
export function getTickTextAnchor(orientation: Orientation, mirror: boolean): TextAnchor {
  switch (orientation) {
    case 'left':
      return mirror ? 'start' : 'end';
    case 'right':
      return mirror ? 'end' : 'start';
    default:
      return 'middle';
  }
}
/**
 * @param orientation The orientation of the axis.
 * @param mirror If true, the ticks are mirrored.
 * @returns The vertical text anchor of the tick.
 */
export function getTickVerticalAnchor(orientation: Orientation, mirror: boolean): TextVerticalAnchor {
  switch (orientation) {
    case 'left':
    case 'right':
      return 'middle';
    case 'top':
      return mirror ? 'start' : 'end';
    default:
      return mirror ? 'end' : 'start';
  }
}
type TicksProps = {
  axisType: 'xAxis' | 'yAxis' | undefined;
  events: Omit<PresentationAttributesAdaptChildEvent<any, SVGElement>, 'scale' | 'viewBox'>;
  fontSize: string;
  getTicksConfig: Omit<Props, 'ticks' | 'ref'>;
  height: number;
  letterSpacing: string;
  mirror: boolean;
  orientation: Orientation;
  padding?: Props['padding'];
  stroke?: Props['stroke'];
  tick?: Props['tick'];
  tickFormatter?: Props['tickFormatter'];
  tickLine?: Props['tickLine'];
  tickMargin: number;
  tickSize: number;
  tickTextProps?: Props['tickTextProps'];
  ticks?: ReadonlyArray<CartesianTickItem>;
  unit?: Props['unit'];
  width: number;
  x: number;
  y: number;
  axisId: AxisId | undefined;
};
