import { createContext, untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import {
  adjustLayoutByDelta,
  near,
  resolveLayout,
  round,
  sameLayout,
  separatorRange,
  toMap,
  validateLayout,
  type Layout,
  type PanelConstraints
} from './layout.js';
import { distance } from './geometry.js';
import { currentInteraction, isCoarsePointer, mountGroup } from './interaction.svelte.js';
import type { LayoutChangeDetails, Orientation, PanelSize, ResizeTargetMinimumSize } from './types.js';
import { toPercent, type SizeInput, type UnitContext } from './units.js';

const KEY_STEP = 5;

export interface HitRegion {
  group: GroupState;
  pivot: [number, number];
  rect: DOMRect;
  separator: SeparatorEntry | undefined;
  /** Pixels the panels shared when the region was found. */
  groupSize: number;
}

export interface GroupOptions {
  readonly orientation: Orientation;
  readonly disabled: boolean;
  readonly disableCursor: boolean;
  readonly resizeTargetMinimumSize: ResizeTargetMinimumSize;
  /** Read once, when the group is created. */
  readonly initial: Layout | undefined;
  readonly onLayoutChange: ((layout: Layout) => void) | undefined;
  readonly onLayoutChanged: ((layout: Layout, details: LayoutChangeDetails) => void) | undefined;
}

export interface PanelOptions {
  id: string;
  defaultSize?: SizeInput;
  minSize?: SizeInput;
  maxSize?: SizeInput;
  collapsible?: boolean;
  collapsedSize?: SizeInput;
  collapsedThreshold?: SizeInput;
}

export class PanelEntry {
  readonly group: GroupState;
  readonly #options: () => PanelOptions;
  element = $state.raw<HTMLElement>();

  constructor(group: GroupState, options: () => PanelOptions) {
    this.group = group;
    this.#options = options;
  }

  get id(): string {
    return this.#options().id;
  }

  index = $derived.by(() => this.group.panels.indexOf(this));

  /** Percent of the group. Before the group mounts it is the size the starting layout names, or 1 to share the space equally. */
  size = $derived.by(() => (this.group.ready ? (this.group.layout[this.index] ?? 0) : (this.group.requested[this.id] ?? 1)));

  collapsed = $derived.by(() => this.group.ready && this.group.collapsedAt(this.index));

  resolve(context: UnitContext): PanelConstraints {
    const { defaultSize, minSize, maxSize, collapsible, collapsedSize, collapsedThreshold } = this.#options();
    const percent = (size: SizeInput | undefined) => (size === undefined ? undefined : toPercent(size, context));
    return {
      collapsible: collapsible ?? false,
      collapsedSize: percent(collapsedSize) ?? 0,
      minSize: percent(minSize) ?? 0,
      maxSize: percent(maxSize) ?? 100,
      defaultSize: percent(defaultSize),
      collapsedThreshold: percent(collapsedThreshold)
    };
  }

  attach: Attachment<HTMLElement> = (element) => {
    this.element = element;
    return () => {
      this.element = undefined;
    };
  };
}

export interface SeparatorOptions {
  disabled: boolean;
  disableDoubleClick: boolean;
}

export class SeparatorEntry {
  readonly group: GroupState;
  readonly #options: () => SeparatorOptions;
  element = $state.raw<HTMLElement>();

  constructor(group: GroupState, options: () => SeparatorOptions) {
    this.group = group;
    this.#options = options;
  }

  get disabled(): boolean {
    return this.group.disabled || this.#options().disabled;
  }

  get disableDoubleClick(): boolean {
    return this.#options().disableDoubleClick;
  }

  /** The panels on either side, in the order they sit on screen. Unknown until the group mounts. */
  pivot = $state.raw<[number, number]>();

  controls = $derived.by(() => (this.pivot ? this.group.panels[this.pivot[0]]?.id : undefined));

  state = $derived.by(() => {
    if (this.disabled) return 'disabled';
    const interaction = currentInteraction();
    return interaction.state !== 'inactive' && interaction.regions.some((region) => region.separator === this) ? interaction.state : 'inactive';
  });

  /** The value and bounds of the panel before the separator. */
  range = $derived.by(() => (this.pivot ? separatorRange(this.group.layout, this.group.constraints, this.pivot[0]) : undefined));

  attach: Attachment<HTMLElement> = (element) => {
    this.element = element;
    untrack(() => this.group.registerSeparator(this));
    return () => {
      untrack(() => this.group.unregisterSeparator(this));
      this.element = undefined;
    };
  };
}

export class GroupState {
  readonly #options: GroupOptions;
  panels = $state.raw<PanelEntry[]>([]);
  separators = $state.raw<SeparatorEntry[]>([]);
  element = $state.raw<HTMLElement>();
  /** True once the group is mounted and measured. */
  ready = $state(false);
  /** Pixels along the axis that the panels share, which excludes the separators. */
  groupSize = $state(0);
  environment = $state.raw({ fontSize: 16, rootFontSize: 16, viewportWidth: 0, viewportHeight: 0 });
  /** What the user or the parent asked for. The layout is this, validated, so a squeezed panel recovers when room returns. */
  requested = $state.raw<Layout>({});

  #expanded: Layout = {};
  #emitted: number[] | undefined;
  #unsettled = false;
  #byUser = false;

  constructor(options: GroupOptions) {
    this.#options = options;
    this.requested = options.initial ?? {};
  }

  get orientation(): Orientation {
    return this.#options.orientation;
  }

  get disabled(): boolean {
    return this.#options.disabled;
  }

  get disableCursor(): boolean {
    return this.#options.disableCursor;
  }

  /** True while a pointer drag moves this group's separators. */
  dragging = $derived.by(() => {
    const interaction = currentInteraction();
    return interaction.state === 'active' && interaction.regions.some((region) => region.group === this);
  });

  context = $derived<UnitContext>({ groupSize: this.groupSize, ...this.environment });
  ids = $derived(this.panels.map((panel) => panel.id));
  constraints = $derived(this.panels.map((panel) => panel.resolve(this.context)));
  layout = $derived(resolveLayout(this.ids, this.constraints, this.requested));
  layoutMap = $derived(toMap(this.ids, this.layout));

  collapsedAt(index: number): boolean {
    const constraint = this.constraints[index];
    return constraint !== undefined && constraint.collapsible && near(this.layout[index], constraint.collapsedSize);
  }

  register(entry: PanelEntry): void {
    this.panels = [...this.panels, entry];
  }

  unregister(entry: PanelEntry): void {
    this.panels = this.panels.filter((panel) => panel !== entry);
  }

  registerSeparator(entry: SeparatorEntry): void {
    this.separators = [...this.separators, entry];
  }

  unregisterSeparator(entry: SeparatorEntry): void {
    this.separators = this.separators.filter((separator) => separator !== entry);
  }

  /** Orders entries the way they sit on screen, so a right-to-left group resizes the panel the pointer is on. */
  #byOffset<T>(entries: T[], elementOf: (entry: T) => HTMLElement | undefined): T[] {
    const horizontal = this.orientation === 'horizontal';
    const keyed = entries.map((entry) => {
      const element = elementOf(entry);
      return { entry, offset: (horizontal ? element?.offsetLeft : element?.offsetTop) ?? 0, size: (horizontal ? element?.offsetWidth : element?.offsetHeight) ?? 0 };
    });
    return keyed.sort((a, b) => a.offset - b.offset || a.size - b.size).map(({ entry }) => entry);
  }

  attach: Attachment<HTMLElement> = (element) => {
    this.element = element;
    const unmount = mountGroup(this, element);
    return () => {
      unmount();
      this.element = undefined;
    };
  };

  /**
   * The places a pointer can grab to resize: each separator, or the gap between two panels with no separator.
   * A region thinner than the minimum target size grows to it around its center.
   */
  hitRegions(): HitRegion[] {
    const element = this.element;
    if (!element) return [];
    const horizontal = this.orientation === 'horizontal';
    const children = this.#byOffset([...element.children].filter((child) => child instanceof HTMLElement), (child) => child);
    const { coarse, fine } = this.#options.resizeTargetMinimumSize;
    const minimum = isCoarsePointer() ? coarse : fine;
    const regions: HitRegion[] = [];
    let previous: { panel: PanelEntry; rect: DOMRect } | undefined;
    let pending: SeparatorEntry[] = [];
    let interleaved = false;
    for (const child of children) {
      if (child.hasAttribute('data-panel')) {
        const panel = this.panels.find((entry) => entry.element === child);
        if (!panel) continue;
        const rect = child.getBoundingClientRect();
        if (previous) {
          const before = previous.rect;
          const firstEdge = () => (horizontal ? new DOMRect(before.right, before.top, 0, before.height) : new DOMRect(before.left, before.bottom, before.width, 0));
          const secondEdge = () => (horizontal ? new DOMRect(rect.left, rect.top, 0, rect.height) : new DOMRect(rect.left, rect.top, rect.width, 0));
          const separators = pending.map((separator) => ({ separator, box: separator.element!.getBoundingClientRect() }));
          let targets: { separator?: SeparatorEntry; box: DOMRect }[];
          if (!interleaved) {
            targets = separators.length
              ? separators
              : [{ box: horizontal ? new DOMRect(before.right, rect.top, rect.left - before.right, rect.height) : new DOMRect(rect.left, before.bottom, rect.width, rect.top - before.bottom) }];
          } else if (separators.length === 0) {
            targets = [{ box: firstEdge() }, { box: secondEdge() }];
          } else if (separators.length === 1) {
            const { box } = separators[0];
            const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
            const axis = horizontal ? 'x' : 'y';
            targets = [separators[0], { box: distance(center, rect)[axis] < distance(center, before)[axis] ? firstEdge() : secondEdge() }];
          } else {
            targets = separators;
          }
          const pivot: [number, number] = [this.panels.indexOf(previous.panel), this.panels.indexOf(panel)];
          for (const { separator, box: target } of targets) {
            let box = target;
            if (box.width < minimum) box = new DOMRect(box.x - (minimum - box.width) / 2, box.y, minimum, box.height);
            if (box.height < minimum) box = new DOMRect(box.x, box.y - (minimum - box.height) / 2, box.width, minimum);
            regions.push({ group: this, pivot, rect: box, separator, groupSize: this.groupSize });
          }
        }
        interleaved = false;
        previous = { panel, rect };
        pending = [];
      } else if (child.hasAttribute('data-separator')) {
        const separator = this.separators.find((entry) => entry.element === child);
        if (separator) {
          pending.push(separator);
        } else {
          previous = undefined;
          pending = [];
        }
      } else {
        interleaved = true;
      }
    }
    return regions;
  }

  measure(): void {
    const element = this.element;
    if (!element) return;
    const horizontal = this.orientation === 'horizontal';
    let size = 0;
    for (const panel of this.panels) {
      const box = panel.element?.getBoundingClientRect();
      if (box) size += horizontal ? box.width : box.height;
    }
    this.groupSize = size;
    const next = {
      fontSize: parseFloat(getComputedStyle(element).fontSize) || 16,
      rootFontSize: parseFloat(getComputedStyle(document.documentElement).fontSize) || 16,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
    const current = this.environment;
    if (Object.keys(next).some((key) => next[key as keyof typeof next] !== current[key as keyof typeof next])) this.environment = next;
  }

  /** Measures the panels now and whenever they or the group resize. Run it in an effect. */
  observe(): (() => void) | undefined {
    const element = this.element;
    if (!element) return;
    const elements = [element, ...this.panels.flatMap((panel) => panel.element ?? [])];
    if (this.separators.some((separator) => !separator.element)) return;
    untrack(() => {
      const panels = this.#byOffset(this.panels, (panel) => panel.element);
      if (panels.some((panel, index) => panel !== this.panels[index])) this.panels = panels;
      const separators = this.#byOffset(this.separators, (separator) => separator.element);
      if (separators.some((separator, index) => separator !== this.separators[index])) this.separators = separators;
      this.measure();
      for (const region of this.hitRegions()) if (region.separator) region.separator.pivot = region.pivot;
    });
    this.ready = true;
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => this.measure());
    for (const observed of elements) observer.observe(observed);
    return () => observer.disconnect();
  }

  /** Reports layout changes. Run it in an effect. A change settles when no drag is running. */
  emit(): void {
    if (!this.ready) return;
    const { layout, layoutMap, dragging } = this;
    untrack(() => {
      if (!this.#emitted || !sameLayout(this.#emitted, layout)) {
        this.#emitted = layout;
        this.#unsettled = true;
        this.#options.onLayoutChange?.(layoutMap);
      }
      if (this.#unsettled && !dragging) {
        const isUserInteraction = this.#byUser;
        this.#unsettled = false;
        this.#byUser = false;
        this.#options.onLayoutChanged?.(layoutMap, { isUserInteraction });
      }
    });
  }

  /** Applies a layout the parent asked for. */
  request(incoming: Layout): void {
    const current = this.layoutMap;
    if (this.ids.every((id) => incoming[id] !== undefined && near(incoming[id], current[id]))) return;
    this.requested = incoming;
  }

  #commit(next: number[], byUser: boolean): void {
    const previous = this.layout;
    const valid = validateLayout(next, this.constraints);
    this.constraints.forEach((constraint, index) => {
      if (!constraint.collapsible) return;
      const id = this.ids[index];
      if (!near(valid[index], constraint.collapsedSize)) this.#expanded[id] = valid[index];
      else if (!near(previous[index], constraint.collapsedSize)) this.#expanded[id] = previous[index];
    });
    this.requested = toMap(this.ids, valid);
    if (byUser && !sameLayout(previous, valid)) this.#byUser = true;
  }

  /** Moves the separator between `pivot` by `delta` percent from `start`. Returns false when the layout cannot change that way. */
  dragTo(start: number[], pivot: [number, number], delta: number): boolean {
    const previous = this.layout;
    const next = adjustLayoutByDelta({ layout: start, prevLayout: previous, constraints: this.constraints, pivot, delta, trigger: 'pointer' });
    if (sameLayout(previous, next)) return false;
    this.#commit(next, true);
    return true;
  }

  keydown(separator: SeparatorEntry, event: KeyboardEvent): void {
    const pivot = separator.pivot;
    if (event.defaultPrevented || separator.disabled || !pivot) return;
    const horizontal = this.orientation === 'horizontal';
    let delta: number | undefined;
    switch (event.key) {
      case 'ArrowRight': if (horizontal) delta = KEY_STEP; break;
      case 'ArrowLeft': if (horizontal) delta = -KEY_STEP; break;
      case 'ArrowDown': if (!horizontal) delta = KEY_STEP; break;
      case 'ArrowUp': if (!horizontal) delta = -KEY_STEP; break;
      case 'Home': delta = -100; break;
      case 'End': delta = 100; break;
      case 'F6': {
        event.preventDefault();
        const { separators } = this;
        const index = separators.indexOf(separator);
        const step = event.shiftKey ? separators.length - 1 : 1;
        separators[(index + step) % separators.length]?.element?.focus();
        return;
      }
      case 'Enter': {
        event.preventDefault();
        const constraint = this.constraints[pivot[0]];
        if (!constraint.collapsible) return;
        const size = this.layout[pivot[0]];
        const target = near(size, constraint.collapsedSize) ? (this.#expanded[this.ids[pivot[0]]] ?? constraint.minSize) : constraint.collapsedSize;
        delta = target - size;
        break;
      }
      default: return;
    }
    event.preventDefault();
    if (delta === undefined) return;
    this.#commit(adjustLayoutByDelta({ layout: this.layout, constraints: this.constraints, pivot, delta, trigger: 'keyboard' }), true);
  }

  /** Resizes the first panel beside the separator that has a default size back to that size. */
  resetToDefault(pivot: [number, number]): boolean {
    const index = pivot.find((candidate) => this.constraints[candidate].defaultSize !== undefined);
    if (index === undefined) return false;
    this.#resizeTo(this.panels[index], this.constraints[index].defaultSize!, true);
    return true;
  }

  /** Moves the separator beside the panel so the panel reaches `percent`. The last panel moves the separator before it. */
  #resizeTo(entry: PanelEntry, percent: number, byUser = false): void {
    const index = entry.index;
    const count = this.panels.length;
    if (index < 0 || count < 2) return;
    const last = index === count - 1;
    const delta = (percent - this.layout[index]) * (last ? -1 : 1);
    const pivot: [number, number] = last ? [index - 1, index] : [index, index + 1];
    this.#commit(adjustLayoutByDelta({ layout: this.layout, constraints: this.constraints, pivot, delta, trigger: 'imperative' }), byUser);
  }

  collapse(entry: PanelEntry): void {
    const constraint = this.constraints[entry.index];
    if (constraint?.collapsible) this.#resizeTo(entry, constraint.collapsedSize);
  }

  expand(entry: PanelEntry): void {
    const constraint = this.constraints[entry.index];
    if (constraint?.collapsible && this.collapsedAt(entry.index)) this.#resizeTo(entry, this.#expanded[entry.id] ?? constraint.minSize);
  }

  resize(entry: PanelEntry, size: SizeInput): void {
    const percent = toPercent(size, this.context);
    if (percent !== undefined) this.#resizeTo(entry, round(percent));
  }

  sizeOf(entry: PanelEntry): PanelSize {
    const asPercentage = this.layout[entry.index] ?? 0;
    return { asPercentage, inPixels: (asPercentage / 100) * this.groupSize };
  }
}

export const [getGroup, setGroup] = createContext<GroupState>();
