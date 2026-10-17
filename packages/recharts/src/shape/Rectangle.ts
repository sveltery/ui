import * as React from '../react.js';
import { SVGProps } from '../react.js';
import { AnimationDuration } from '../util/types.js';
import { EasingInput } from '../animation/easing.js';
import { round, roundTemplateLiteral } from '../util/round.js';
/**
 * @inline
 */
export type RectRadius = number | [number, number, number, number];
export const getRectanglePath = (x: number, y: number, width: number, height: number, radius: RectRadius): string => {
  const roundedWidth = round(width);
  const roundedHeight = round(height);
  const maxRadius = Math.min(Math.abs(roundedWidth) / 2, Math.abs(roundedHeight) / 2);
  const ySign = roundedHeight >= 0 ? 1 : -1;
  const xSign = roundedWidth >= 0 ? 1 : -1;
  const clockWise = (roundedHeight >= 0 && roundedWidth >= 0) || (roundedHeight < 0 && roundedWidth < 0) ? 1 : 0;
  let path;

  if (maxRadius > 0 && Array.isArray(radius)) {
    const newRadius: RectRadius = [0, 0, 0, 0];
    for (let i = 0, len = 4; i < len; i++) {
      const r: number = radius[i] ?? 0;
      newRadius[i] = r > maxRadius ? maxRadius : r;
    }

    path = roundTemplateLiteral`M${x},${y + ySign * newRadius[0]}`;

    if (newRadius[0] > 0) {
      path += roundTemplateLiteral`A ${newRadius[0]},${newRadius[0]},0,0,${clockWise},${x + xSign * newRadius[0]},${y}`;
    }

    path += roundTemplateLiteral`L ${x + width - xSign * newRadius[1]},${y}`;

    if (newRadius[1] > 0) {
      path += roundTemplateLiteral`A ${newRadius[1]},${newRadius[1]},0,0,${clockWise},
        ${x + width},${y + ySign * newRadius[1]}`;
    }
    path += roundTemplateLiteral`L ${x + width},${y + height - ySign * newRadius[2]}`;

    if (newRadius[2] > 0) {
      path += roundTemplateLiteral`A ${newRadius[2]},${newRadius[2]},0,0,${clockWise},
        ${x + width - xSign * newRadius[2]},${y + height}`;
    }
    path += roundTemplateLiteral`L ${x + xSign * newRadius[3]},${y + height}`;

    if (newRadius[3] > 0) {
      path += roundTemplateLiteral`A ${newRadius[3]},${newRadius[3]},0,0,${clockWise},
        ${x},${y + height - ySign * newRadius[3]}`;
    }
    path += 'Z';
  } else if (maxRadius > 0 && radius === +radius && radius > 0) {
    const newRadius = Math.min(maxRadius, radius);

    path = roundTemplateLiteral`M ${x},${y + ySign * newRadius}
            A ${newRadius},${newRadius},0,0,${clockWise},${x + xSign * newRadius},${y}
            L ${x + width - xSign * newRadius},${y}
            A ${newRadius},${newRadius},0,0,${clockWise},${x + width},${y + ySign * newRadius}
            L ${x + width},${y + height - ySign * newRadius}
            A ${newRadius},${newRadius},0,0,${clockWise},${x + width - xSign * newRadius},${y + height}
            L ${x + xSign * newRadius},${y + height}
            A ${newRadius},${newRadius},0,0,${clockWise},${x},${y + height - ySign * newRadius} Z`;
  } else {
    path = roundTemplateLiteral`M ${x},${y} h ${width} v ${height} h ${-width} Z`;
  }

  return path;
};
interface RectangleProps {
  className?: string;
  /**
   * The x-coordinate of top left point of the rectangle.
   * @defaultValue 0
   */
  x?: number;
  /**
   * The y-coordinate of top left point of the rectangle.
   * @defaultValue 0
   */
  y?: number;
  /**
   * Width of the rectangle in pixels.
   * @defaultValue 0
   */
  width?: number;
  /**
   * Height of the rectangle in pixels.
   * @defaultValue 0
   */
  height?: number;
  /**
   * The radius of corners.
   *
   * If you provide a single number, it applies to all four corners.
   * If you provide an array of four numbers, they apply to top-left, top-right, bottom-right, bottom-left corners respectively.
   *
   * @see {@link https://recharts.github.io/en-US/guide/roundedBars/ Guide: Rounded bar corners}
   *
   * @defaultValue 0
   */
  radius?: RectRadius;
  /**
   * @defaultValue false
   */
  isAnimationActive?: boolean;
  /**
   * @defaultValue false
   */
  isUpdateAnimationActive?: boolean;
  /**
   * @defaultValue 0
   */
  animationBegin?: number;
  /**
   * @defaultValue 1500
   */
  animationDuration?: AnimationDuration;
  /**
   * @defaultValue ease
   */
  animationEasing?: EasingInput;

  /**
   * The customized event handler of click on the rectangle
   */
  onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mousedown on the rectangle
   */
  onMouseDown?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mouseup on the rectangle
   */
  onMouseUp?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mousemove on the rectangle
   */
  onMouseMove?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mouseover on the rectangle
   */
  onMouseOver?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mouseout on the rectangle
   */
  onMouseOut?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mouseenter on the rectangle
   */
  onMouseEnter?: (e: React.MouseEvent<SVGPathElement>) => void;
  /**
   * The customized event handler of mouseleave on the rectangle
   */
  onMouseLeave?: (e: React.MouseEvent<SVGPathElement>) => void;
}
export type Props = Omit<SVGProps<SVGPathElement>, 'radius'> & RectangleProps;
export const defaultRectangleProps = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  radius: 0,
  isAnimationActive: false,
  isUpdateAnimationActive: false,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
} as const satisfies Partial<Props>;
