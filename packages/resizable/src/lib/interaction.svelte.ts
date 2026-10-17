import type { GroupState, HitRegion } from './group-state.svelte.js';
import { distance, intersects, type Point } from './geometry.js';
import { compare } from './stacking-order.js';

export type Interaction =
  | { state: 'inactive' }
  | { state: 'hover'; regions: HitRegion[] }
  | { state: 'active'; regions: HitRegion[]; initial: Map<GroupState, number[]>; origin: Point };

const HORIZONTAL_MIN = 0b0001;
const HORIZONTAL_MAX = 0b0010;
const VERTICAL_MIN = 0b0100;
const VERTICAL_MAX = 0b1000;
const HORIZONTAL = HORIZONTAL_MIN | HORIZONTAL_MAX;
const VERTICAL = VERTICAL_MIN | VERTICAL_MAX;

let interaction = $state.raw<Interaction>({ state: 'inactive' });
let cursorFlags = 0;
// eslint-disable-next-line svelte/prefer-svelte-reactivity -- the pointer listeners read it; nothing renders it
const mounted = new Set<GroupState>();
// eslint-disable-next-line svelte/prefer-svelte-reactivity -- listener reference counts; nothing renders them
const documents = new Map<Document, number>();
const sheets = new WeakMap<Document, { sheet: CSSStyleSheet; rule: string | undefined }>();

export function currentInteraction(): Interaction {
  return interaction;
}

let coarse: boolean | undefined;
export function isCoarsePointer(): boolean {
  coarse ??= typeof matchMedia === 'function' && matchMedia('(pointer:coarse)').matches;
  return coarse;
}

let advancedCursors: boolean | undefined;
function supportsAdvancedCursors(): boolean {
  advancedCursors ??= typeof navigator !== 'undefined' && (navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Firefox'));
  return advancedCursors;
}

function cursorFor(groups: GroupState[], state: Interaction['state']): string | undefined {
  const shown = groups.filter((group) => !group.disableCursor);
  const horizontal = shown.some((group) => group.orientation === 'horizontal');
  const vertical = shown.some((group) => group.orientation === 'vertical');
  if (state === 'inactive' || (!horizontal && !vertical)) return undefined;
  const advanced = supportsAdvancedCursors();
  if (state === 'active' && cursorFlags && advanced) {
    const ns = cursorFlags & VERTICAL_MIN ? 's' : cursorFlags & VERTICAL_MAX ? 'n' : '';
    const ew = cursorFlags & HORIZONTAL_MIN ? 'e' : cursorFlags & HORIZONTAL_MAX ? 'w' : '';
    if (ns || ew) return `${ns}${ew}-resize`;
  }
  if (horizontal && vertical) return advanced ? 'move' : 'grab';
  if (horizontal) return advanced ? 'ew-resize' : 'col-resize';
  return advanced ? 'ns-resize' : 'row-resize';
}

function updateCursor(document: Document): void {
  const view = document.defaultView;
  if (!view) return;
  let entry = sheets.get(document);
  if (!entry) {
    entry = { sheet: new view.CSSStyleSheet(), rule: undefined };
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, entry.sheet];
    sheets.set(document, entry);
  }
  const current = interaction;
  const cursor = current.state === 'inactive' ? undefined : cursorFor(current.regions.map((region) => region.group), current.state);
  const rule = cursor && `*, *:hover {cursor: ${cursor} !important; ${current.state === 'active' ? 'touch-action: none;' : ''} }`;
  if (rule === entry.rule) return;
  entry.rule = rule;
  entry.sheet.replaceSync(rule ?? '');
}

/** False when another element paints over the region at the pointer, such as a dialog above the group. */
function isViableTarget(group: HTMLElement, region: DOMRect, target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement) || target.contains(group) || group.contains(target)) return true;
  if (compare(target, group) > 0) {
    for (let element: HTMLElement | null = target; element; element = element.parentElement) {
      if (element.contains(group)) return true;
      if (intersects(element.getBoundingClientRect(), region)) return false;
    }
  }
  return true;
}

function regionsAt(event: { clientX: number; clientY: number; target: EventTarget | null }): HitRegion[] {
  const point = { x: event.clientX, y: event.clientY };
  const matches: HitRegion[] = [];
  for (const group of mounted) {
    if (group.disabled || !group.element) continue;
    const axis = group.orientation === 'horizontal' ? 'x' : 'y';
    let closest: { region: HitRegion; distance: Point } | undefined;
    for (const region of group.hitRegions()) {
      const next = distance(point, region.rect);
      if (!closest || next[axis] <= closest.distance[axis]) closest = { region, distance: next };
    }
    if (closest && closest.distance.x <= 0 && closest.distance.y <= 0 && isViableTarget(group.element, closest.region.rect, event.target)) {
      matches.push(closest.region);
    }
  }
  return matches.filter((region) => !region.separator?.disabled);
}

function drag(document: Document, event: { clientX: number; clientY: number; movementX: number; movementY: number }, origin: Point | undefined): void {
  if (interaction.state !== 'active') return;
  const { regions, initial } = interaction;
  let flags = 0;
  for (const region of regions) {
    const { group } = region;
    const horizontal = group.orientation === 'horizontal';
    const delta = origin
      ? (((horizontal ? event.clientX - origin.x : event.clientY - origin.y)) / region.groupSize) * 100
      : (horizontal ? event.clientX : event.clientY) < 0 ? -100 : 100;
    const start = initial.get(group);
    if (start && !group.dragTo(start, region.pivot, delta) && delta !== 0 && !group.disableCursor) {
      flags |= horizontal ? (delta < 0 ? HORIZONTAL_MIN : HORIZONTAL_MAX) : delta < 0 ? VERTICAL_MIN : VERTICAL_MAX;
    }
  }
  cursorFlags =
    (event.movementX === 0 ? cursorFlags & HORIZONTAL : flags & HORIZONTAL) |
    (event.movementY === 0 ? cursorFlags & VERTICAL : flags & VERTICAL);
  updateCursor(document);
}

function finish(): void {
  cursorFlags = 0;
  interaction = { state: 'inactive' };
}

function onPointerDown(event: PointerEvent): void {
  if (event.defaultPrevented || (event.pointerType === 'mouse' && event.button > 0)) return;
  const regions = regionsAt(event);
  regions.find((region) => region.separator)?.separator?.element?.focus();
  interaction = {
    state: 'active',
    regions,
    initial: new Map(regions.map((region) => [region.group, region.group.layout])),
    origin: { x: event.clientX, y: event.clientY }
  };
  if (regions.length) event.preventDefault();
}

function onPointerMove(event: PointerEvent): void {
  if (event.defaultPrevented) return;
  const document = event.currentTarget as Document;
  if (interaction.state === 'active') {
    if (event.buttons === 0) {
      finish();
      return;
    }
    drag(document, event, interaction.origin);
    return;
  }
  const regions = regionsAt(event);
  if (regions.length) interaction = { state: 'hover', regions };
  else if (interaction.state !== 'inactive') interaction = { state: 'inactive' };
  updateCursor(document);
}

function onPointerUp(event: PointerEvent): void {
  if (event.defaultPrevented || (event.pointerType === 'mouse' && event.button > 0) || interaction.state !== 'active') return;
  const { regions } = interaction;
  finish();
  if (!regions.length) return;
  updateCursor(event.currentTarget as Document);
  event.preventDefault();
}

function onPointerLeave(event: PointerEvent): void {
  drag(event.currentTarget as Document, event, undefined);
}

function onPointerOut(event: PointerEvent): void {
  if (event.relatedTarget instanceof HTMLIFrameElement && interaction.state === 'hover') interaction = { state: 'inactive' };
}

function onDoubleClick(event: MouseEvent): void {
  if (event.defaultPrevented) return;
  for (const region of regionsAt(event)) {
    if (region.separator && !region.separator.disableDoubleClick && region.group.resetToDefault(region.pivot)) event.preventDefault();
  }
}

const listeners = [
  ['dblclick', onDoubleClick, true],
  ['pointerdown', onPointerDown, true],
  ['pointerleave', onPointerLeave, false],
  ['pointermove', onPointerMove, false],
  ['pointerout', onPointerOut, false],
  ['pointerup', onPointerUp, true]
] as const;

/** Lets the document's pointer listeners find the group. The listeners are added with the first group in a document and removed with the last. */
export function mountGroup(group: GroupState, element: HTMLElement): () => void {
  const document = element.ownerDocument;
  mounted.add(group);
  const count = (documents.get(document) ?? 0) + 1;
  documents.set(document, count);
  if (count === 1) for (const [type, listener, capture] of listeners) document.addEventListener(type, listener as EventListener, capture);
  return () => {
    mounted.delete(group);
    const remaining = (documents.get(document) ?? 1) - 1;
    documents.set(document, remaining);
    if (remaining === 0) for (const [type, listener, capture] of listeners) document.removeEventListener(type, listener as EventListener, capture);
  };
}
