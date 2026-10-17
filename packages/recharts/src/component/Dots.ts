import { type Props as DotProps } from '../shape/Dot.js';
import { DataKey, DotItemDotProps, DotType } from '../util/types.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
export interface DotPoint {
  readonly x: number | null;
  readonly y: number | null;
  readonly value?: any;
  readonly payload?: any;
}
type DotItemProps = {
  option: DotType;
  dotProps: DotItemDotProps;
  className: string;
};
export type DotsDotProps = Omit<DotProps, 'cx' | 'cy' | 'key' | 'index' | 'dataKey' | 'value' | 'payload'>;
interface DotsProps extends ZIndexable {
  /**
   * Points to render dots for
   */
  points: ReadonlyArray<DotPoint>;
  /**
   * Dot configuration - boolean, ReactElement, function, or props object
   */
  dot: DotType;
  /**
   * Base class name for the dots layer (e.g., 'recharts-area-dots')
   */
  className: string;
  /**
   * Base class name for individual dot (e.g., 'recharts-area-dot')
   */
  dotClassName: string;
  /**
   * DataKey for the data
   */
  dataKey: DataKey<any> | undefined;
  /**
   * Base props to spread onto each dot (from parent component).
   * Except some properties that the Dots component manages itself.
   */
  baseProps: DotsDotProps;
  /**
   * Whether clipping is needed (cartesian only)
   */
  needClip?: boolean;
  /**
   * Clip path ID (cartesian only)
   */
  clipPathId?: string;
}
