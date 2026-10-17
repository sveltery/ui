import { PresentationAttributesWithProps } from '../util/types.js';
interface DotProps {
  className?: string;
  /**
   * The x-coordinate of center in pixels.
   */
  cx?: number;
  /**
   * The y-coordinate of center in pixels.
   */
  cy?: number;
  /**
   * The radius of dot.
   */
  r?: number | string;
  clipDot?: boolean;
}
export type Props = PresentationAttributesWithProps<DotProps, SVGCircleElement> & DotProps;
