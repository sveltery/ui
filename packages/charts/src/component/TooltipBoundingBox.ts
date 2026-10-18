import * as React from '../react.js';
import { AllowInDimension, AnimationDuration, AnimationTiming, CartesianViewBox, Coordinate, PolarCoordinate } from '../util/types.js';
import { ElementOffset, SetElementOffset } from '../util/useElementOffset.js';
export type TooltipBoundingBoxProps = {
  active: boolean;
  allowEscapeViewBox: AllowInDimension;
  animationDuration: AnimationDuration;
  animationEasing: AnimationTiming;
  children: React.ReactNode;
  coordinate: Coordinate | PolarCoordinate | undefined;
  hasPayload: boolean;
  isAnimationActive: boolean | 'auto';
  offset: number | Coordinate;
  position: Partial<Coordinate> | undefined;
  reverseDirection: AllowInDimension;
  useTranslate3d: boolean;
  viewBox: CartesianViewBox;
  wrapperStyle: React.CSSProperties;
  lastBoundingBox: ElementOffset;
  innerRef: SetElementOffset;
  hasPortalFromProps: boolean;
};
export function resolveTransitionProperty(args: {
  prefersReducedMotion: boolean;
  isAnimationActive: boolean | 'auto';
  active: boolean;
  animationDuration: number;
  animationEasing: string;
}): `transform ${number}ms ${string}` | undefined {
  if (args.prefersReducedMotion && args.isAnimationActive === 'auto') {
    return undefined;
  }
  if (args.isAnimationActive && args.active) {
    return `transform ${args.animationDuration}ms ${args.animationEasing}`;
  }
  return undefined;
}
