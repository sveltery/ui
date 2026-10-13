/** Panel id to percent of the group, 0 to 100. */
export type Layout = Record<string, number>;

/** Panel constraints resolved to percent of the group. */
export interface PanelConstraints {
  collapsible: boolean;
  collapsedSize: number;
  minSize: number;
  maxSize: number;
  defaultSize: number | undefined;
  /** How far past `minSize` a panel must move to collapse, or past `collapsedSize` to expand. Defaults to half the distance between them. */
  collapsedThreshold?: number;
}

export type ResizeTrigger = 'keyboard' | 'pointer' | 'imperative';

/** Rounds to 3 decimals, the precision layouts are compared at. */
export function round(value: number): number {
  return parseFloat(value.toFixed(3));
}

export function near(a: number, b: number, tolerance = 0): boolean {
  return Math.abs(round(a) - round(b)) <= tolerance;
}

function compare(a: number, b: number): -1 | 0 | 1 {
  return near(a, b) ? 0 : a > b ? 1 : -1;
}

export function sameLayout(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((size, index) => near(size, b[index]));
}

export function toMap(ids: readonly string[], layout: readonly number[]): Layout {
  return Object.fromEntries(ids.map((id, index) => [id, layout[index]]));
}

/**
 * Clamps one panel size to its constraints. A collapsible panel snaps to its collapsed size once it is
 * dragged `collapsedThreshold` below its minimum, and back to the minimum once it is dragged that far
 * above its collapsed size. `prevSize` decides which side the panel starts from.
 */
export function clampPanelSize(constraints: PanelConstraints, size: number, prevSize: number): number {
  const { collapsible, collapsedSize, collapsedThreshold, minSize, maxSize } = constraints;
  if (compare(size, minSize) < 0) {
    if (collapsible) {
      const threshold = collapsedThreshold ?? (minSize - collapsedSize) / 2;
      const wasCollapsed = compare(prevSize, collapsedSize) <= 0;
      const boundary = compare(size, wasCollapsed ? collapsedSize + threshold : minSize - threshold);
      const collapse = compare(size, collapsedSize) <= 0 || boundary < 0 || (collapsedThreshold !== undefined && wasCollapsed && boundary === 0);
      size = collapse ? collapsedSize : minSize;
    } else {
      size = minSize;
    }
  }
  return round(Math.min(maxSize, size));
}

/** Scales a layout to 100, clamps every panel and hands the clamped difference to the panels that can take it. */
export function validateLayout(layout: readonly number[], constraints: readonly PanelConstraints[]): number[] {
  const total = layout.reduce((sum, size) => sum + size, 0);
  const next = [...layout];
  if (!near(total, 100) && next.length > 0) {
    for (let index = 0; index < next.length; index++) next[index] = (100 / total) * next[index];
  }
  let remaining = 0;
  for (let index = 0; index < next.length; index++) {
    const size = next[index];
    const clamped = clampPanelSize(constraints[index], size, layout[index]);
    if (size !== clamped) {
      remaining += size - clamped;
      next[index] = clamped;
    }
  }
  if (!near(remaining, 0)) {
    for (let index = 0; index < next.length; index++) {
      const size = next[index];
      const clamped = clampPanelSize(constraints[index], size + remaining, size);
      if (size !== clamped) {
        remaining -= clamped - size;
        next[index] = clamped;
        if (near(remaining, 0)) break;
      }
    }
  }
  return next;
}

/**
 * Moves the separator between `pivot[0]` and `pivot[1]` by `delta` percent. Positive grows the first
 * panel. The panels on the shrinking side give up space in turn, so a panel at its minimum passes the
 * rest of the move to its neighbor. Returns `prevLayout` when the move is not possible.
 */
export function adjustLayoutByDelta(args: {
  layout: readonly number[];
  constraints: readonly PanelConstraints[];
  pivot: readonly [number, number];
  delta: number;
  trigger: ResizeTrigger;
  prevLayout?: readonly number[];
}): number[] {
  const { layout, constraints, pivot, trigger } = args;
  const prevLayout = args.prevLayout ?? layout;
  let delta = args.delta;
  if (near(delta, 0)) return [...layout];
  const next = [...layout];
  const [first, second] = pivot;
  let moved = 0;

  if (trigger === 'keyboard') {
    // A collapsed panel opens to its minimum in one step, and a panel at its minimum collapses in one step.
    const growing = constraints[delta < 0 ? second : first];
    if (growing.collapsible && near(layout[delta < 0 ? second : first], growing.collapsedSize)) {
      const toMinimum = growing.minSize - layout[delta < 0 ? second : first];
      if (compare(toMinimum, Math.abs(delta)) > 0) delta = delta < 0 ? -toMinimum : toMinimum;
    }
    const shrinking = constraints[delta < 0 ? first : second];
    if (shrinking.collapsible && near(layout[delta < 0 ? first : second], shrinking.minSize)) {
      const toCollapsed = layout[delta < 0 ? first : second] - shrinking.collapsedSize;
      if (compare(toCollapsed, Math.abs(delta)) > 0) delta = delta < 0 ? -toCollapsed : toCollapsed;
    }
  } else {
    // A collapsed panel opens only once the move passes its threshold.
    const growIndex = delta < 0 ? second : first;
    const grow = constraints[growIndex];
    if (grow.collapsible && compare(layout[growIndex], grow.minSize) < 0) {
      const span = grow.minSize - grow.collapsedSize;
      const threshold = grow.collapsedThreshold ?? span / 2;
      if (compare(layout[growIndex] + Math.abs(delta), grow.minSize) < 0) {
        const passed = compare(Math.abs(delta), threshold);
        delta = passed > 0 || (passed === 0 && grow.collapsedThreshold === undefined && delta < 0) ? (delta < 0 ? -span : span) : 0;
      }
    }
  }

  {
    // The panels on the growing side can only take as much as their maximums allow.
    const step = delta < 0 ? 1 : -1;
    let index = delta < 0 ? second : first;
    let room = 0;
    while (index >= 0 && index < layout.length) {
      room += clampPanelSize(constraints[index], 100, layout[index]) - layout[index];
      index += step;
    }
    const limit = Math.min(Math.abs(delta), Math.abs(room));
    delta = delta < 0 ? -limit : limit;
  }

  {
    // The panels on the shrinking side give up space, nearest first.
    let index = delta < 0 ? first : second;
    while (index >= 0 && index < layout.length) {
      const share = Math.abs(delta) - Math.abs(moved);
      const size = layout[index];
      const clamped = clampPanelSize(constraints[index], size - share, size);
      if (!near(size, clamped)) {
        moved += size - clamped;
        next[index] = clamped;
        if (round(moved) >= round(Math.abs(delta))) break;
      }
      index += delta < 0 ? -1 : 1;
    }
  }

  if (sameLayout(prevLayout, next)) return [...prevLayout];

  {
    // The growing side takes what was given up, and what its first panel refuses moves on to the next.
    const index = delta < 0 ? second : first;
    const wanted = layout[index] + moved;
    const clamped = clampPanelSize(constraints[index], wanted, layout[index]);
    next[index] = clamped;
    if (!near(clamped, wanted)) {
      let leftover = wanted - clamped;
      let cursor = index;
      while (cursor >= 0 && cursor < layout.length) {
        const size = next[cursor];
        const adjusted = clampPanelSize(constraints[cursor], size + leftover, size);
        if (!near(size, adjusted)) {
          leftover -= adjusted - size;
          next[cursor] = adjusted;
        }
        if (near(leftover, 0)) break;
        cursor += delta > 0 ? -1 : 1;
      }
    }
  }

  return near(next.reduce((sum, size) => sum + size, 0), 100, 0.1) ? next : [...prevLayout];
}

/**
 * Builds the layout for `ids` from the requested sizes, falling back to each panel's default. Panels
 * with neither share what is left equally. The result is validated against the constraints.
 */
export function resolveLayout(ids: readonly string[], constraints: readonly PanelConstraints[], requested: Layout): number[] {
  const sizes = ids.map((id, index) => requested[id] ?? constraints[index].defaultSize);
  const unset = sizes.filter(size => size === undefined).length;
  if (unset > 0) {
    const left = Math.max(0, 100 - sizes.reduce<number>((sum, size) => sum + (size ?? 0), 0));
    return validateLayout(sizes.map(size => size ?? left / unset), constraints);
  }
  return validateLayout(sizes as number[], constraints);
}

/** The value, minimum and maximum of the panel before a separator, as percent. The minimum and maximum come from moving the separator as far as the neighbors allow. */
export function separatorRange(layout: readonly number[], constraints: readonly PanelConstraints[], index: number): { now: number; min: number; max: number } {
  const now = layout[index];
  const { collapsible, collapsedSize, minSize, maxSize } = constraints[index];
  const reach = (target: number) =>
    validateLayout(adjustLayoutByDelta({ layout, constraints, pivot: [index, index + 1], delta: target - now, trigger: 'pointer' }), constraints)[index];
  return { now, min: reach(collapsible ? collapsedSize : minSize), max: reach(maxSize) };
}
