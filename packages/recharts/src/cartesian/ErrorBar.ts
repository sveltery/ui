import { SVGProps } from '../react.js';
import { AnimationTiming, DataKey } from '../util/types.js';
import { BarRectangleItem } from './Bar.js';
import { LinePointItem } from './Line.js';
import { ScatterPointItem } from './Scatter.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
export interface ErrorBarDataItem {
  x: number | undefined;
  y: number | undefined;
  value: number;
  errorVal?: number[] | number;
}
/**
 * So usually the direction is decided by the chart layout.
 * Horizontal layout means error bars are vertical means direction=y
 * Vertical layout means error bars are horizontal means direction=x
 *
 * Except! In Scatter chart, error bars can go both ways.
 *
 * So this property is only ever used in Scatter chart, and ignored elsewhere.
 */
export type ErrorBarDirection = 'x' | 'y';
export type ErrorBarDataPointFormatter<T extends BarRectangleItem | LinePointItem | ScatterPointItem> = (
  entry: T,
  dataKey: DataKey<T, number[] | number>,
  direction: ErrorBarDirection,
) => ErrorBarDataItem;
/**
 * External ErrorBar props, visible for users of the library
 */
interface ErrorBarProps<DataPointType = any, DataValueType = any> extends ZIndexable {
  /**
   * Decides how to extract the value of this ErrorBar from the data:
   * - `string`: the name of the field in the data object;
   * - `number`: the index of the field in the data;
   * - `function`: a function that receives the data object and returns the value of this ErrorBar.
   *
   * The error values can be a single value for symmetric error bars;
   * or an array of a lower and upper error value for asymmetric error bars.
   */
  dataKey: DataKey<DataPointType, DataValueType>;
  /**
   * Width of the error bar ends (the serifs) in pixels.
   * This is not the total width of the error bar, but just the width of the little lines at the ends.
   *
   * The total width of the error bar is determined by the data value plus/minus the error value.
   *
   * @defaultValue 5
   */
  width?: number;
  /**
   * Direction of the error bar. Usually determined by chart layout, except in Scatter chart.
   * In Scatter chart, "x" means horizontal error bars, "y" means vertical error bars.
   */
  direction?: ErrorBarDirection;
  /**
   * @defaultValue true
   */
  isAnimationActive?: boolean;
  /**
   * @defaultValue 0
   */
  animationBegin?: number;
  /**
   * @defaultValue 400
   */
  animationDuration?: number;
  /**
   * @defaultValue ease-in-out
   */
  animationEasing?: AnimationTiming;
  /**
   * The width of the stroke
   */
  strokeWidth?: number | string;
  /**
   * The stroke color. If "none", no line will be drawn.
   *
   * @defaultValue black
   */
  stroke?: string;
  /**
   * @defaultValue 400
   */
  zIndex?: number;
}
export type Props = SVGProps<SVGLineElement> & ErrorBarProps;
/**
 * Props after defaults, and required props have been applied.
 */
type ErrorBarInternalProps = SVGProps<SVGLineElement> & {
  dataKey: DataKey<any>;
  /** the width of the error bar ends */
  width: number;
  /**
   * Only used for ScatterChart with error bars in two directions.
   * Only accepts a value of "x" or "y" and makes the error bars lie in that direction.
   */
  direction: ErrorBarDirection;
  isAnimationActive: boolean;
  animationBegin: number;
  animationDuration: number;
  animationEasing: AnimationTiming;
};
