export type Point = { x: number; y: number };

/** How far a point is outside a rect on each axis, 0 when it is within the rect's span. */
export function distance(point: Point, rect: DOMRect): Point {
  const along = (value: number, start: number, end: number) => (value >= start && value <= end ? 0 : Math.min(Math.abs(value - start), Math.abs(value - end)));
  return { x: along(point.x, rect.left, rect.right), y: along(point.y, rect.top, rect.bottom) };
}

export function intersects(a: DOMRect, b: DOMRect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
