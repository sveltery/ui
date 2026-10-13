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
import type { LayoutChangeDetails, Orientation, PanelSize } from './types.js';
import { toPercent, type SizeInput, type UnitContext } from './units.js';

const KEY_STEP = 5;

export interface GroupOptions {
  readonly orientation: Orientation;
  readonly disabled: boolean;
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
}

interface Drag {
  separator: SeparatorEntry;
  pointerId: number;
  pivot: [number, number];
  origin: number;
  layout: number[];
  size: number;
  sign: 1 | -1;
  userSelect: string;
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

  /** Percent of the group. Before the group mounts it is the panel's own default, so server and first client render agree. */
  size = $derived.by(() => (this.group.ready ? (this.group.layout[this.index] ?? 0) : this.group.provisionalSize(this)));

  collapsed = $derived.by(() => this.group.ready && this.group.collapsedAt(this.index));

  resolve(context: UnitContext): PanelConstraints {
    const { defaultSize, minSize, maxSize, collapsible, collapsedSize } = this.#options();
    const percent = (size: SizeInput | undefined) => (size === undefined ? undefined : toPercent(size, context));
    return {
      collapsible: collapsible ?? false,
      collapsedSize: percent(collapsedSize) ?? 0,
      minSize: percent(minSize) ?? 0,
      maxSize: percent(maxSize) ?? 100,
      defaultSize: percent(defaultSize)
    };
  }

  attach: Attachment<HTMLElement> = (element) => {
    this.element = element;
    this.group.sortPanels();
    return () => {
      this.element = undefined;
    };
  };
}

export class SeparatorEntry {
  readonly group: GroupState;
  readonly #options: () => { disabled: boolean };
  readonly #registeredAfter: number;
  element = $state.raw<HTMLElement>();
  hovered = $state(false);

  constructor(group: GroupState, options: () => { disabled: boolean }) {
    this.group = group;
    this.#options = options;
    this.#registeredAfter = group.panels.length;
  }

  get disabled(): boolean {
    return this.group.disabled || this.#options().disabled;
  }

  /** Index of the panel before this separator. The server and the first render count the panels registered so far. */
  index = $derived.by(() => {
    const element = this.element;
    if (!element) return this.#registeredAfter - 1;
    const before = this.group.panels.filter(
      (panel) => panel.element && element.compareDocumentPosition(panel.element) & Node.DOCUMENT_POSITION_PRECEDING
    );
    return before.length - 1;
  });

  controls = $derived.by(() => this.group.panels[this.index]?.id);

  state = $derived.by(() => (this.disabled ? 'disabled' : this.group.active === this ? 'active' : this.hovered ? 'hover' : 'inactive'));

  /** The value and bounds of the panel before the separator. The bounds are unknown until the group mounts. */
  range = $derived.by((): { now: number; min?: number; max?: number } | undefined => {
    const { group, index } = this;
    if (index < 0 || index + 1 >= group.panels.length) return undefined;
    if (!group.ready) return { now: group.provisionalSize(group.panels[index]) };
    return separatorRange(group.layout, group.constraints, index);
  });

  attach: Attachment<HTMLElement> = (element) => {
    this.element = element;
    return () => {
      this.element = undefined;
    };
  };
}

export class GroupState {
  readonly #options: GroupOptions;
  panels = $state.raw<PanelEntry[]>([]);
  element = $state.raw<HTMLElement>();
  /** True once the group is mounted and measured. */
  ready = $state(false);
  /** The separator being dragged. */
  active = $state.raw<SeparatorEntry>();
  /** Pixels along the axis that the panels share, which excludes the separators. */
  groupSize = $state(0);
  environment = $state.raw({ fontSize: 16, rootFontSize: 16, viewportWidth: 0, viewportHeight: 0 });
  /** What the user or the parent asked for. The layout is this, validated, so a squeezed panel recovers when room returns. */
  requested = $state.raw<Layout>({});

  #drag: Drag | undefined;
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

  context = $derived<UnitContext>({ groupSize: this.groupSize, ...this.environment });
  ids = $derived(this.panels.map((panel) => panel.id));
  constraints = $derived(this.panels.map((panel) => panel.resolve(this.context)));
  layout = $derived(resolveLayout(this.ids, this.constraints, this.requested));
  layoutMap = $derived(toMap(this.ids, this.layout));

  collapsedAt(index: number): boolean {
    const constraint = this.constraints[index];
    return constraint !== undefined && constraint.collapsible && near(this.layout[index], constraint.collapsedSize);
  }

  /** The size a panel renders with before the group is measured. Panels without one take what the panels before them leave. */
  provisionalSize(entry: PanelEntry): number {
    const known = (panel: PanelEntry): number | undefined => {
      const { defaultSize } = panel.resolve(this.context);
      return this.requested[panel.id] ?? defaultSize;
    };
    let used = 0;
    for (const panel of this.panels) {
      if (panel === entry) break;
      used += known(panel) ?? 0;
    }
    return known(entry) ?? Math.max(0, 100 - used);
  }

  register(entry: PanelEntry): void {
    this.panels = [...this.panels, entry];
  }

  unregister(entry: PanelEntry): void {
    this.panels = this.panels.filter((panel) => panel !== entry);
  }

  /** Restores document order after a panel is inserted between existing ones. */
  sortPanels(): void {
    const sorted = [...this.panels].sort((a, b) => {
      if (!a.element || !b.element) return 0;
      return a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    if (sorted.some((panel, index) => panel !== this.panels[index])) this.panels = sorted;
  }

  attach: Attachment<HTMLElement> = (element) => {
    this.element = element;
    return () => {
      this.element = undefined;
    };
  };

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
    untrack(() => this.measure());
    this.ready = true;
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => this.measure());
    for (const observed of elements) observer.observe(observed);
    return () => observer.disconnect();
  }

  /** Reports layout changes. Run it in an effect. A change settles when no drag is running. */
  emit(): void {
    if (!this.ready) return;
    const { layout, layoutMap } = this;
    const dragging = this.active !== undefined;
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

  #pivot(separator: SeparatorEntry): [number, number] | undefined {
    const index = separator.index;
    return index >= 0 && index + 1 < this.panels.length ? [index, index + 1] : undefined;
  }

  #rtl(): boolean {
    return this.orientation === 'horizontal' && this.element !== undefined && getComputedStyle(this.element).direction === 'rtl';
  }

  beginDrag(separator: SeparatorEntry, event: PointerEvent): void {
    const pivot = this.#pivot(separator);
    if (separator.disabled || !pivot || this.groupSize <= 0) return;
    this.#drag = {
      separator,
      pointerId: event.pointerId,
      pivot,
      origin: this.orientation === 'horizontal' ? event.clientX : event.clientY,
      layout: this.layout,
      size: this.groupSize,
      sign: this.#rtl() ? -1 : 1,
      userSelect: document.body.style.userSelect
    };
    document.body.style.userSelect = 'none';
    this.active = separator;
  }

  moveDrag(event: PointerEvent): void {
    const drag = this.#drag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const point = this.orientation === 'horizontal' ? event.clientX : event.clientY;
    const delta = ((point - drag.origin) / drag.size) * 100 * drag.sign;
    this.#commit(
      adjustLayoutByDelta({ layout: drag.layout, prevLayout: this.layout, constraints: this.constraints, pivot: drag.pivot, delta, trigger: 'pointer' }),
      true
    );
  }

  endDrag(event: PointerEvent): void {
    const drag = this.#drag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    document.body.style.userSelect = drag.userSelect;
    this.#drag = undefined;
    this.active = undefined;
  }

  keydown(separator: SeparatorEntry, event: KeyboardEvent): void {
    const pivot = this.#pivot(separator);
    if (event.defaultPrevented || separator.disabled || !pivot) return;
    const horizontal = this.orientation === 'horizontal';
    const flip = this.#rtl() ? -1 : 1;
    let delta: number | undefined;
    switch (event.key) {
      case 'ArrowRight': if (horizontal) delta = KEY_STEP * flip; break;
      case 'ArrowLeft': if (horizontal) delta = -KEY_STEP * flip; break;
      case 'ArrowDown': if (!horizontal) delta = KEY_STEP; break;
      case 'ArrowUp': if (!horizontal) delta = -KEY_STEP; break;
      case 'Home': delta = -100; break;
      case 'End': delta = 100; break;
      case 'Enter': {
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

  /** Moves the separator beside the panel so the panel reaches `percent`. The last panel moves the separator before it. */
  #resizeTo(entry: PanelEntry, percent: number): void {
    const index = entry.index;
    const count = this.panels.length;
    if (index < 0 || count < 2) return;
    const last = index === count - 1;
    const delta = (percent - this.layout[index]) * (last ? -1 : 1);
    const pivot: [number, number] = last ? [index - 1, index] : [index, index + 1];
    this.#commit(adjustLayoutByDelta({ layout: this.layout, constraints: this.constraints, pivot, delta, trigger: 'imperative' }), false);
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
