import { CSSProperties, ReactNode } from '../react.js';
import { Percent } from '../util/types.js';
export interface Props {
  /**
   * width / height. If specified, the height will be calculated by width / aspect.
   */
  aspect?: number;
  /**
   * The width of chart container.
   * Can be a number or a percent string like "100%".
   * @default '100%'
   */
  width?: Percent | number;
  /**
   * The height of chart container.
   * Can be a number or a percent string like "100%".
   * @default '100%'
   */
  height?: Percent | number;
  /**
   * The minimum width of the container.
   * @default 0
   */
  minWidth?: string | number;
  /**
   * The minimum height of the container.
   */
  minHeight?: string | number;
  /**
   * The initial width and height of the container.
   * @default {"width":-1,"height":-1}
   */
  initialDimension?: {
    width: number;
    height: number;
  };
  /** The maximum height of the container. It can be a number. */
  maxHeight?: number;
  /**
   * The content of the container.
   * It can contain multiple charts, and then they will all share the same dimensions.
   */
  children: ReactNode;
  /**
   * If specified a positive number, debounced function will be used to handle the resize event.
   * @default 0
   */
  debounce?: number;
  /**
   * Unique identifier of this component.
   * Used as an HTML attribute `id`.
   */
  id?: string | number;
  /** The HTML element's class name */
  className?: string | number;
  /** The style of the container. */
  style?: Omit<CSSProperties, keyof Props>;
  /**
   * If specified provides a callback providing the updated chart width and height values.
   */
  onResize?: (width: number, height: number) => void;
}
