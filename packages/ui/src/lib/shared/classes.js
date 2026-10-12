import { cn } from 'cn';
/**
 * @param {string} base
 * @param {import('cn').ClassValue} [value]
 */
export function classes(base, value) {
  return cn(base, value);
}
export const closeBase = 'cn-button group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0';
