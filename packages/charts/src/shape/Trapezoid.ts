import * as React from '../react.js';
import { SVGProps } from '../react.js';
import { AnimationDuration, AnimationTiming } from '../util/types.js';
import { roundTemplateLiteral } from '../util/round.js';
export const getTrapezoidPath = (x: number, y: number, upperWidth: number, lowerWidth: number, height: number): string => {
  const widthGap = upperWidth - lowerWidth;
  let path;
  path = roundTemplateLiteral`M ${x},${y}`;
  path += roundTemplateLiteral`L ${x + upperWidth},${y}`;
  path += roundTemplateLiteral`L ${x + upperWidth - widthGap / 2},${y + height}`;
  path += roundTemplateLiteral`L ${x + upperWidth - widthGap / 2 - lowerWidth},${y + height}`;
  path += roundTemplateLiteral`L ${x},${y} Z`;
  return path;
};
interface TrapezoidProps {
  className?: string;
  /**
   * The x-coordinate of top left point of the trapezoid.
   * @default 0
   */
  x?: number;
  /**
   * The y-coordinate of top left point of the trapezoid.
   * @default 0
   */
  y?: number;
  /**
   * Width of the upper horizontal side of the trapezoid in pixels.
   * @default 0
   */
  upperWidth?: number;
  /**
   * Width of the lower horizontal side of the trapezoid in pixels.
   * @default 0
   */
  lowerWidth?: number;
  /**
   * Height of the trapezoid in pixels.
   * @default 0
   */
  height?: number;

  /**
   * If set to true, trapezoid will update and render with a gradual fade-in animation from left to right.
   * @default false
   */
  isUpdateAnimationActive?: boolean;
  animationBegin?: number;
  animationDuration?: AnimationDuration;
  animationEasing?: AnimationTiming;

  /**
   * The customized event handler of click on the trapezoid
   */
  onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mousedown on the trapezoid
   */
  onMouseDown?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mouseup on the trapezoid
   */
  onMouseUp?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mousemove on the trapezoid
   */
  onMouseMove?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mouseover on the trapezoid
   */
  onMouseOver?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mouseout on the trapezoid
   */
  onMouseOut?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mouseenter on the trapezoid
   */
  onMouseEnter?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mouseleave on the trapezoid
   */
  onMouseLeave?: (e: React.MouseEvent<SVGPathElement>) => void;
}
export type Props = SVGProps<SVGPathElement> & TrapezoidProps;
export const defaultTrapezoidProps = {
  x: 0,
  y: 0,
  upperWidth: 0,
  lowerWidth: 0,
  height: 0,
  isUpdateAnimationActive: false,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
} as const satisfies Partial<Props>;
