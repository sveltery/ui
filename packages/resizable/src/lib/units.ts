/** A size a panel prop accepts. A number is pixels. A string carries its unit, and a bare "25" means percent. */
export type SizeInput = number | string;

export interface UnitContext {
  /** Pixels along the group axis that the panels share, which excludes the separators. */
  groupSize: number;
  /** Font size of the group, for `em`. */
  fontSize: number;
  /** Font size of the root element, for `rem`. */
  rootFontSize: number;
  viewportWidth: number;
  viewportHeight: number;
}

const SIZE = /^\s*(\d+\.?\d*|\.\d+)\s*(px|%|rem|em|vh|vw)?\s*$/iu;

/** Converts a size to percent of the group. Returns undefined when the group has no measured size yet and the unit is not percent. */
export function toPercent(size: SizeInput, ctx: UnitContext): number | undefined {
  let value: number;
  let unit: string;
  if (typeof size === 'number') {
    value = size;
    unit = 'px';
  } else {
    const match = SIZE.exec(size);
    if (!match) throw new TypeError(`Invalid size "${size}". Use a number of pixels or a string such as "25%", "200px", "2rem", "1em", "50vh" or "50vw".`);
    value = Number(match[1]);
    unit = (match[2] ?? '%').toLowerCase();
  }
  if (unit === '%') return value;
  const pixels = unit === 'px' ? value
    : unit === 'rem' ? value * ctx.rootFontSize
    : unit === 'em' ? value * ctx.fontSize
    : unit === 'vh' ? (value * ctx.viewportHeight) / 100
    : (value * ctx.viewportWidth) / 100;
  return ctx.groupSize > 0 ? (pixels / ctx.groupSize) * 100 : undefined;
}
