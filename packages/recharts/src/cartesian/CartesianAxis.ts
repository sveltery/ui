import * as React from '../react.js';
import { SVGProps } from '../react.js';
import { Props as TextProps } from '../component/Text.js';
import { ImplicitLabelType } from '../component/Label.js';
import { CartesianViewBox, PresentationAttributesAdaptChildEvent, CartesianTickItem, AxisInterval, TickProp } from '../util/types.js';
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
