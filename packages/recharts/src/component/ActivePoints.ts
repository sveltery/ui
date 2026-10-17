import { ActiveDotType, DataKey } from '../util/types.js';
import { ZIndexable } from '../zIndex/ZIndexLayer.js';
export interface PointType {
  readonly x: number | null;
  readonly y: number | null;
  readonly value?: any;
  readonly payload?: any;
}
export interface ActivePointsProps extends ZIndexable {
  points: ReadonlyArray<PointType>;
  /**
   * Different graphical elements have different opinion on what is their main color.
   * Sometimes stroke, sometimes fill, sometimes combination.
   * `undefined` means that the color is not set, and the point will be transparent.
   */
  mainColor: string | undefined;
  itemDataKey: DataKey<any> | undefined;
  activeDot: ActiveDotType;
  clipPath?: string;
}
