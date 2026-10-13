/**
 * What the user sees, in what order, and where the arrow keys go, as one pure function. The CSS `order` slots, the
 * visibility flags, the keyboard's list and the count Empty reads are fields of the same `View`, so they cannot disagree.
 */

export type CommandFilter = (value: string, search: string, keywords?: readonly string[]) => number;

export interface GroupEntry {
  readonly forceMount: boolean;
}

export interface ItemEntry<G extends GroupEntry = GroupEntry> {
  /** Undefined until the item's text has been measured. */
  readonly value: string | undefined;
  readonly keywords: readonly string[];
  readonly disabled: boolean;
  /** The item's own `forceMount`, else its group's. */
  readonly forceMount: boolean;
  readonly group: G | undefined;
}

export interface RankInput<I extends ItemEntry<G>, G extends GroupEntry> {
  /** Document order. */
  readonly items: readonly I[];
  /** Document order. */
  readonly groups: readonly G[];
  readonly search: string;
  /** Null when `shouldFilter` is false: nothing is filtered or sorted. */
  readonly filter: CommandFilter | null;
}

export interface View<I, G> {
  /** Whether scores apply. When false, DOM order is the visual order and no slots are emitted. */
  readonly ranked: boolean;
  readonly visibleItems: ReadonlySet<I>;
  readonly visibleGroups: ReadonlySet<G>;
  /** Visible items in the order the user sees them, disabled ones included. */
  readonly ordered: readonly I[];
  /** The items the arrow keys can land on, in visual order. */
  readonly navigable: readonly I[];
  /** Visible groups in visual order. Alt+Arrow walks this. */
  readonly groupOrder: readonly G[];
  /** Navigable items per group in visual order. The first one brings its group heading into view with it. */
  readonly groupItems: ReadonlyMap<G, readonly I[]>;
  /** CSS `order` of each item inside its container (the list sizer or its group's items). Empty unless ranked. */
  readonly itemSlot: ReadonlyMap<I, number>;
  /** CSS `order` of each group inside the list sizer, after the ungrouped items. Empty unless ranked. */
  readonly groupSlot: ReadonlyMap<G, number>;
  /** Visible items that are not force-mounted. Empty renders when this is 0. */
  readonly count: number;
}

export function rank<I extends ItemEntry<G>, G extends GroupEntry>({ items, groups, search, filter }: RankInput<I, G>): View<I, G> {
  const ranked = filter !== null && search !== '';
  const scores = new Map<I, number>();
  const known = new Set(groups);

  // Force-mounted and unmeasured items stay visible but unscored, so they sort last.
  const visible: I[] = [];
  let count = 0;
  for (const item of items) {
    let show = true;
    if (ranked && !item.forceMount && item.value !== undefined) {
      const score = item.value === '' ? 0 : filter(item.value, search, item.keywords);
      scores.set(item, score);
      show = score > 0;
    }
    if (!show) continue;
    visible.push(item);
    if (!item.forceMount) count += 1;
  }

  const loose: I[] = [];
  const buckets = new Map<G, I[]>(groups.map((group) => [group, []]));
  for (const item of visible) {
    if (item.group !== undefined && known.has(item.group)) buckets.get(item.group)!.push(item);
    else loose.push(item);
  }

  const score = (item: I) => scores.get(item) ?? 0;
  const byScore = (a: I, b: I) => score(b) - score(a);
  const shown = (group: G) => !ranked || group.forceMount || buckets.get(group)!.length > 0;
  let groupOrder = groups.filter(shown);
  if (ranked) {
    // Array.prototype.sort is stable, so ties keep document order.
    loose.sort(byScore);
    for (const bucket of buckets.values()) bucket.sort(byScore);
    const best = (group: G) => Math.max(0, ...buckets.get(group)!.map(score));
    groupOrder = groupOrder.sort((a, b) => best(b) - best(a));
  }

  const itemSlot = new Map<I, number>();
  const groupSlot = new Map<G, number>();
  if (ranked) {
    loose.forEach((item, index) => itemSlot.set(item, index + 1));
    groupOrder.forEach((group, index) => {
      groupSlot.set(group, loose.length + index + 1);
      buckets.get(group)!.forEach((item, position) => itemSlot.set(item, position + 1));
    });
  }

  const usable = (item: I) => !item.disabled && item.value !== undefined && item.value !== '';
  // Unranked, the order is the document's (cmdk parity). Ranked, ungrouped items come first, then each group's.
  const ordered = ranked ? [...loose, ...groupOrder.flatMap((group) => buckets.get(group)!)] : visible;
  const groupItems = new Map<G, readonly I[]>(groupOrder.map((group) => [group, buckets.get(group)!.filter(usable)]));

  return {
    ranked,
    visibleItems: new Set(visible),
    visibleGroups: new Set(groupOrder),
    ordered,
    navigable: ordered.filter(usable),
    groupOrder,
    groupItems,
    itemSlot,
    groupSlot,
    count
  };
}

/** One step through `list`. From nothing selected, Down lands on the first entry and Up, when looping, on the last. */
export function step<T>(list: readonly T[], from: T | undefined, delta: 1 | -1, loop: boolean): T | undefined {
  const next = (from === undefined ? -1 : list.indexOf(from)) + delta;
  if (!loop) return list[next];
  return next < 0 ? list.at(-1) : next >= list.length ? list[0] : list[next];
}

/** Alt+Arrow. Steps one item instead when `from` is in no group or no group with items lies that way (cmdk parity). */
export function stepGroup<I extends ItemEntry<G>, G extends GroupEntry>(
  view: View<I, G>,
  from: I | undefined,
  delta: 1 | -1,
  loop: boolean
): I | undefined {
  const at = from?.group === undefined ? -1 : view.groupOrder.indexOf(from.group);
  if (at < 0) return step(view.navigable, from, delta, loop);
  for (let index = at + delta; index >= 0 && index < view.groupOrder.length; index += delta) {
    const first = view.groupItems.get(view.groupOrder[index])![0];
    if (first !== undefined) return first;
  }
  return step(view.navigable, from, delta, loop);
}
