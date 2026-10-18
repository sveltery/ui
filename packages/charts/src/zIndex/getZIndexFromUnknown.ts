import { isWellBehavedNumber } from '../util/isWellBehavedNumber.js';

export function getZIndexFromUnknown(input: unknown, defaultZIndex: number): number {
  if (
    input &&
    typeof input === 'object' &&
    'zIndex' in input &&
    typeof input.zIndex === 'number' &&
    isWellBehavedNumber(input.zIndex)
  ) {
    return input.zIndex;
  }
  return defaultZIndex;
}
