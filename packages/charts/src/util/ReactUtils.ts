import { ActiveDotType, DotType } from './types.js';
export const isClipDot = (dot: ActiveDotType | DotType): boolean => {
  if (dot && typeof dot === 'object' && 'clipDot' in dot) {
    return Boolean(dot.clipDot);
  }
  return true;
};
