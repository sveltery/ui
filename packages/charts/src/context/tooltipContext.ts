import * as React from '../react.js';
import { Coordinate } from '../util/types.js';
import { TooltipPayload } from '../state/tooltipSlice.js';
/**
 * Some graphical items choose to provide more information to the tooltip
 * and some do not.
 */
export type TooltipTriggerInfo = {
  tooltipPayload?: TooltipPayload;
  tooltipPosition?: Coordinate;
};
export type MouseEnterLeaveEvent<T, E extends SVGElement = SVGElement> = (
  data: T,
  index: number,
  event: React.MouseEvent<E>,
) => void;
