import { createContext, untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';
import {
  getContentBottom,
  getElementScrollTop,
  getElementTop,
  getElementViewportTop,
  getFirstVisibleMessageItem,
  getFlexGap,
  getLastScrollAnchor,
  getMaxScrollTop,
  getMessageScrollerItems,
  getMessageScrollerScrollable,
  getMessageScrollerVisibilityState,
  getNewScrollAnchor,
  getTailSpacerHeight,
  getUnanchoredScrollAnchor,
  hasMultipleNewScrollAnchors
} from './geometry.js';
import {
  AUTOSCROLLING_CLEAR_DELAY,
  EMPTY_MESSAGE_SCROLLER_SCROLLABLE,
  EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE,
  SCROLL_POSITION_EPSILON,
  USER_SCROLL_KEYS,
  type MessageScrollerDefaultScrollPosition,
  type MessageScrollerMode,
  type MessageScrollerScrollable,
  type MessageScrollerScrollOptions,
  type MessageScrollerVisibilityState
} from './types.js';

export interface MessageScrollerOptions {
  readonly autoScroll: boolean;
  readonly defaultScrollPosition: MessageScrollerDefaultScrollPosition;
  readonly scrollEdgeThreshold: number;
  readonly scrollPreviousItemPeek: number;
  readonly scrollMargin: number;
}

/** Only the anchored mode holds a turn, so a held turn outside it cannot exist. */
type ScrollState = { mode: Exclude<MessageScrollerMode, 'anchored-to-message'> } | { mode: 'anchored-to-message'; turn: HTMLElement };

interface PendingTarget {
  messageId: string;
  options?: MessageScrollerScrollOptions;
}

interface PrependAnchor {
  element: HTMLElement;
  viewportTop: number;
}

const sameVisibility = (a: MessageScrollerVisibilityState, b: MessageScrollerVisibilityState) =>
  a.currentAnchorId === b.currentAnchorId && a.visibleMessageIds.length === b.visibleMessageIds.length && a.visibleMessageIds.every((id, index) => id === b.visibleMessageIds[index]);

export class MessageScroller {
  readonly #options: MessageScrollerOptions;
  #scrollable = $state.raw<MessageScrollerScrollable>(EMPTY_MESSAGE_SCROLLER_SCROLLABLE);
  #visibility = $state.raw<MessageScrollerVisibilityState>(EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE);
  #autoscrolling = $state(false);
  #pendingScroll = $state(false);

  #state: ScrollState;
  #viewport: HTMLElement | null = null;
  #content: HTMLElement | null = null;
  #spacer: HTMLElement | null = null;
  #spacerGap = 0;
  #spacerHeight = 0;
  #preserveScrollOnPrepend: () => boolean = () => true;
  // eslint-disable-next-line svelte/prefer-svelte-reactivity -- registry for commands and observers; nothing renders it
  #messages = new Map<string, HTMLElement>();
  #itemCount = 0;
  #firstItem: HTMLElement | null = null;
  /** The scrollTop of the previous commit, so a reader scrolling up is told apart from content growing past the end. */
  #lastScrollTop = 0;
  #defaultApplied = false;
  #openedAt: MessageScrollerDefaultScrollPosition;
  #pendingTarget: PendingTarget | null = null;
  /** The row held steady on the next prepend: the first visible row, or a jump target. */
  #prependAnchor: PrependAnchor | null = null;
  #handledAnchors = new WeakSet<HTMLElement>();
  #stateFrame: number | undefined;
  #visibilityFrame: number | undefined;
  #pendingFrame: number | undefined;
  #autoscrollTimer: ReturnType<typeof setTimeout> | undefined;
  #visibilityObserver: IntersectionObserver | null = null;
  // eslint-disable-next-line svelte/prefer-svelte-reactivity -- observer bookkeeping; the published visibility is the reactive value
  #visibleIds = new Set<string>();
  #tracking = false;

  constructor(options: MessageScrollerOptions) {
    this.#options = options;
    this.#state = { mode: options.autoScroll ? 'following-bottom' : 'free-scrolling' };
    this.#openedAt = options.defaultScrollPosition;
    this.#pendingScroll = options.defaultScrollPosition !== 'start';
  }

  /** Which edges the viewport can still scroll toward. `end` stays false while following new output. */
  get scrollable(): MessageScrollerScrollable {
    return this.#scrollable;
  }

  #subscribeVisibility = createSubscriber(() => {
    this.#tracking = true;
    this.#observeVisibility();
    return () => {
      this.#tracking = false;
      this.#unobserveVisibility();
    };
  });

  /** Visible rows and the current turn. Tracked only while an effect or template reads it. */
  get visibility(): MessageScrollerVisibilityState {
    this.#subscribeVisibility();
    return this.#visibility;
  }

  readonly stateAttributes = $derived({
    'data-pending-scroll': this.#pendingScroll ? '' : undefined,
    'data-scrollable': [this.#scrollable.start && 'start', this.#scrollable.end && 'end'].filter(Boolean).join(' ') || undefined,
    'data-autoscrolling': this.#autoscrolling ? '' : undefined
  });

  scrollToStart({ behavior = 'auto' }: MessageScrollerScrollOptions = {}): boolean {
    return untrack(() => {
      if (!this.#viewport) return false;
      this.#setTailSpacerHeight(0);
      this.#state = { mode: 'free-scrolling' };
      this.#scrollToPosition(0, { behavior });
      this.#scheduleVisibilitySync();
      return true;
    });
  }

  scrollToEnd({ behavior = 'auto' }: MessageScrollerScrollOptions = {}): boolean {
    return untrack(() => {
      const viewport = this.#viewport;
      if (!viewport) return false;
      this.#setTailSpacerHeight(0);
      this.#state = { mode: this.#options.autoScroll ? 'following-bottom' : 'free-scrolling' };
      this.#scrollToPosition(getMaxScrollTop(viewport), { behavior, autoscrolling: true });
      this.#scheduleVisibilitySync();
      return true;
    });
  }

  /** Jumps to a row. Before any row exists the target is queued and applied once it mounts. */
  scrollToMessage(messageId: string, options?: MessageScrollerScrollOptions): boolean {
    return untrack(() => {
      const element = this.#messages.get(messageId);
      if (!element) {
        if (this.#itemCount > 0) return false;
        this.#pendingTarget = { messageId, options };
        this.#markDefaultApplied();
        return true;
      }
      this.#markDefaultApplied();
      this.#pendingTarget = this.#scrollToElement(element, options) ? null : { messageId, options };
      return true;
    });
  }

  /** Re-applies the opening position when it changes. Run it in an effect. */
  openAt(position: MessageScrollerDefaultScrollPosition): void {
    untrack(() => {
      if (position !== this.#openedAt) {
        this.#openedAt = position;
        this.#defaultApplied = false;
      }
      if (!this.#applyDefaultScrollPosition() && this.#itemCount === 0) this.#pendingScroll = false;
    });
  }

  /** Follows the end when autoScroll turns on at the bottom. Run it in an effect. */
  autoScrollChanged(autoScroll: boolean): void {
    untrack(() => {
      if (autoScroll && this.#state.mode === 'following-bottom' && this.#itemCount > 0) {
        this.scrollToEnd();
        return;
      }
      // Upstream stays following here, which keeps publishing `end: false` and hides the button over real overflow.
      if (!autoScroll && this.#state.mode === 'following-bottom') this.#state = { mode: 'free-scrolling' };
      this.#commitScrollState();
    });
  }

  viewport(preserveScrollOnPrepend: () => boolean): Attachment<HTMLElement> {
    return (element) =>
      untrack(() => {
        this.#viewport = element;
        this.#preserveScrollOnPrepend = preserveScrollOnPrepend;
        const intent = () => this.#userScrollIntent();
        const cleanups = [
          on(element, 'scroll', () => this.#syncAfterScroll()),
          on(element, 'wheel', intent, { passive: true }),
          on(element, 'touchmove', intent, { passive: true }),
          on(element, 'keydown', (event) => {
            if (USER_SCROLL_KEYS.has(event.key)) intent();
          }),
          this.#observeResize(element)
        ];
        this.#observeVisibility();
        this.#reconcileIfConnected();
        return () => {
          for (const cleanup of cleanups) cleanup();
          this.#disconnectViewport();
        };
      });
  }

  content: Attachment<HTMLElement> = (element) =>
    untrack(() => {
      this.#content = element;
      const mutations = typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(() => this.#handleContentChange());
      mutations?.observe(element, { childList: true });
      const stopResize = this.#observeResize(element);
      this.#reconcileIfConnected();
      return () => {
        mutations?.disconnect();
        stopResize();
        this.#content = null;
      };
    });

  spacer: Attachment<HTMLElement> = (element) => {
    this.#spacer = element;
    this.#spacerGap = getFlexGap(element.parentElement);
    return () => {
      this.#spacer = null;
      this.#spacerHeight = 0;
    };
  };

  item(messageId: string | undefined): Attachment<HTMLElement> | undefined {
    if (!messageId) return;
    return (element) =>
      untrack(() => {
        this.#messages.set(messageId, element);
        this.#visibilityObserver?.observe(element);
        this.#scheduleVisibilitySync();
        if (this.#pendingTarget?.messageId === messageId) this.#schedulePendingFlush();
        return () => {
          if (this.#messages.get(messageId) !== element) return;
          this.#messages.delete(messageId);
          this.#visibleIds.delete(messageId);
          this.#visibilityObserver?.unobserve(element);
          this.#scheduleVisibilitySync();
        };
      });
  }

  // Effects run children first, so the content attaches before the viewport that wraps it. Reconcile once both exist.
  #reconcileIfConnected(): void {
    if (this.#viewport && this.#content) this.#handleContentChange();
  }

  #disconnectViewport(): void {
    cancelAnimationFrame(this.#stateFrame ?? 0);
    cancelAnimationFrame(this.#visibilityFrame ?? 0);
    cancelAnimationFrame(this.#pendingFrame ?? 0);
    clearTimeout(this.#autoscrollTimer);
    this.#stateFrame = this.#visibilityFrame = this.#pendingFrame = this.#autoscrollTimer = undefined;
    this.#visibilityObserver?.disconnect();
    this.#visibilityObserver = null;
    this.#visibleIds.clear();
    this.#viewport = null;
  }

  // Coalesced into a frame: the resize handler resizes the spacer inside the observed content, which would otherwise loop the observer.
  #observeResize(element: HTMLElement): () => void {
    if (typeof ResizeObserver === 'undefined') return () => {};
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => this.#handleResize());
    });
    observer.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }

  // Arms follow at the bottom and releases it when scrollTop moves up (a scrollbar drag fires only scroll events).
  // Growth past the end must not release it, and neither may the programmatic scroll to the end itself.
  // Arming skips the anchored hold: the tail spacer makes a fresh anchor read as at the end, and the first streamed chunk would yank the reader off it.
  #reconcileFollowMode(scrollable: MessageScrollerScrollable): void {
    const scrollTop = this.#viewport?.scrollTop ?? 0;
    const scrolledUp = scrollTop < this.#lastScrollTop - SCROLL_POSITION_EPSILON;
    this.#lastScrollTop = scrollTop;
    const { mode } = this.#state;
    if (this.#options.autoScroll && !scrollable.end && mode !== 'settling-jump' && mode !== 'anchored-to-message') {
      this.#state = { mode: 'following-bottom' };
    } else if (mode === 'following-bottom' && scrollable.end && scrolledUp && !this.#autoscrolling) {
      this.#state = { mode: 'free-scrolling' };
    }
  }

  #commitScrollState(): void {
    const next = getMessageScrollerScrollable({
      content: this.#content,
      scrollEdgeThreshold: this.#options.scrollEdgeThreshold,
      spacer: this.#spacer,
      viewport: this.#viewport
    });
    this.#reconcileFollowMode(next);
    // While following, the gap a streamed chunk opens is about to close; publishing it would strobe the scroll button per chunk.
    const end = this.#state.mode === 'following-bottom' ? false : next.end;
    if (next.start !== this.#scrollable.start || end !== this.#scrollable.end) this.#scrollable = { start: next.start, end };
  }

  #scheduleStateCommit(): void {
    if (this.#stateFrame !== undefined) return;
    this.#stateFrame = requestAnimationFrame(() => {
      this.#stateFrame = undefined;
      this.#commitScrollState();
    });
  }

  #scheduleVisibilitySync(): void {
    if (!this.#tracking || this.#visibilityFrame !== undefined) return;
    this.#visibilityFrame = requestAnimationFrame(() => {
      this.#visibilityFrame = undefined;
      if (!this.#tracking) return;
      const next = getMessageScrollerVisibilityState({
        content: this.#content,
        scrollMargin: this.#options.scrollMargin,
        scrollPreviousItemPeek: this.#options.scrollPreviousItemPeek,
        spacer: this.#spacer,
        viewport: this.#viewport,
        visibleMessageIds: this.#visibleIds
      });
      if (!sameVisibility(this.#visibility, next)) this.#visibility = next;
    });
  }

  #observeVisibility(): void {
    const viewport = this.#viewport;
    if (!viewport || !this.#tracking) return;
    if (typeof IntersectionObserver === 'undefined') {
      this.#scheduleVisibilitySync();
      return;
    }
    // The root's top edge shrinks to the reading line so a previous turn peeking above it is not reported as visible.
    this.#visibilityObserver ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const messageId = (entry.target as HTMLElement).dataset.messageId;
          if (!messageId) continue;
          if (entry.isIntersecting) this.#visibleIds.add(messageId);
          else this.#visibleIds.delete(messageId);
        }
        this.#scheduleVisibilitySync();
      },
      { root: viewport, rootMargin: `${-(this.#options.scrollMargin + this.#options.scrollPreviousItemPeek)}px 0px 0px 0px`, threshold: [0, 0.01, 0.5, 1] }
    );
    for (const element of this.#messages.values()) this.#visibilityObserver.observe(element);
    this.#scheduleVisibilitySync();
  }

  #unobserveVisibility(): void {
    cancelAnimationFrame(this.#visibilityFrame ?? 0);
    this.#visibilityFrame = undefined;
    this.#visibilityObserver?.disconnect();
    this.#visibilityObserver = null;
    this.#visibleIds.clear();
    this.#visibility = EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE;
  }

  #setAutoscrolling(autoscrolling: boolean): void {
    clearTimeout(this.#autoscrollTimer);
    this.#autoscrollTimer = undefined;
    if (this.#autoscrolling !== autoscrolling) {
      this.#autoscrolling = autoscrolling;
      this.#commitScrollState();
    }
    if (!autoscrolling) return;
    this.#autoscrollTimer = setTimeout(() => {
      this.#autoscrollTimer = undefined;
      this.#autoscrolling = false;
      this.#commitScrollState();
    }, AUTOSCROLLING_CLEAR_DELAY);
  }

  #setTailSpacerHeight(height: number): void {
    const spacer = this.#spacer;
    if (!spacer) return;
    const next = Math.max(0, Math.ceil(height));
    if (next === this.#spacerHeight) return;
    this.#spacerHeight = next;
    spacer.hidden = next === 0;
    spacer.style.height = `${next}px`;
    spacer.style.marginTop = next > 0 ? `${-this.#spacerGap}px` : '';
  }

  #scrollToPosition(scrollTop: number, { behavior = 'auto', autoscrolling = false }: { behavior?: ScrollBehavior; autoscrolling?: boolean }): void {
    const viewport = this.#viewport;
    if (!viewport) return;
    const top = Math.max(0, scrollTop);
    if (Math.abs(viewport.scrollTop - top) <= SCROLL_POSITION_EPSILON) {
      viewport.scrollTop = top;
      this.#commitScrollState();
      return;
    }
    if (autoscrolling) this.#setAutoscrolling(true);
    viewport.scrollTo({ top, behavior });
    this.#scheduleStateCommit();
  }

  /** `anchor` places a new turn at the reading line with the previous row peeking above, and holds it there while it streams. */
  #scrollToElement(element: HTMLElement, { align = 'start', behavior = 'auto', scrollMargin = this.#options.scrollMargin }: MessageScrollerScrollOptions = {}, anchor = false): boolean {
    const content = this.#content;
    const viewport = this.#viewport;
    if (!content || !viewport || !content.contains(element)) return false;
    const scrollTop = getElementScrollTop({
      align,
      element,
      scrollMargin: anchor ? scrollMargin + this.#options.scrollPreviousItemPeek : scrollMargin,
      spacer: this.#spacer,
      viewport
    });
    this.#setTailSpacerHeight(getTailSpacerHeight({ content, scrollTop, spacer: this.#spacer, viewport }));
    // Seeded with the jump target so a prepend landing before the scroll settles still preserves it.
    this.#prependAnchor = { element, viewportTop: getElementViewportTop(element, viewport) };
    this.#state = anchor ? { mode: 'anchored-to-message', turn: element } : { mode: 'settling-jump' };
    this.#scrollToPosition(scrollTop, { behavior });
    this.#scheduleVisibilitySync();
    return true;
  }

  #anchorTo(element: HTMLElement): boolean {
    return this.#scrollToElement(element, { align: 'start' }, true);
  }

  #flushPendingTarget(): boolean {
    const pending = this.#pendingTarget;
    if (!pending) return false;
    const element = this.#messages.get(pending.messageId);
    if (!element || !this.#scrollToElement(element, pending.options)) return false;
    this.#pendingTarget = null;
    this.#markDefaultApplied();
    return true;
  }

  #schedulePendingFlush(): void {
    if (this.#pendingFrame !== undefined) return;
    this.#pendingFrame = requestAnimationFrame(() => {
      this.#pendingFrame = undefined;
      if (this.#flushPendingTarget()) this.#capturePrependAnchor();
    });
  }

  #markDefaultApplied(): void {
    this.#defaultApplied = true;
    this.#pendingScroll = false;
  }

  #applyDefaultScrollPosition(): boolean {
    if (this.#defaultApplied || this.#itemCount === 0) return false;
    const position = this.#options.defaultScrollPosition;
    let handled: boolean;
    if (position === 'last-anchor') {
      const content = this.#content;
      const viewport = this.#viewport;
      const anchor = content && viewport ? getLastScrollAnchor(getMessageScrollerItems(content, this.#spacer)) : null;
      if (!content || !viewport || !anchor) {
        handled = this.scrollToEnd();
      } else {
        // A short last turn already fits below its anchor, so the end shows all of it without a blank gap.
        const fits = getContentBottom({ content, spacer: this.#spacer, viewport }) - getElementTop(anchor, viewport) <= viewport.clientHeight;
        handled = fits ? this.scrollToEnd() : this.#anchorTo(anchor);
      }
    } else {
      handled = position === 'end' ? this.scrollToEnd() : this.scrollToStart();
    }
    if (handled) this.#markDefaultApplied();
    return handled;
  }

  #restorePrependAnchor(): void {
    const anchor = this.#prependAnchor;
    const viewport = this.#viewport;
    if (!anchor || !viewport || !anchor.element.isConnected) return;
    // Viewport-relative, so this is a no-op where native scroll anchoring already kept the row in place.
    const delta = getElementViewportTop(anchor.element, viewport) - anchor.viewportTop;
    if (Math.abs(delta) <= SCROLL_POSITION_EPSILON) return;
    viewport.scrollTop += delta;
    anchor.viewportTop = getElementViewportTop(anchor.element, viewport);
    this.#scheduleStateCommit();
    this.#scheduleVisibilitySync();
  }

  #capturePrependAnchor(): void {
    const content = this.#content;
    const viewport = this.#viewport;
    const element = content && viewport ? getFirstVisibleMessageItem({ content, spacer: this.#spacer, viewport }) : null;
    this.#prependAnchor = element && viewport ? { element, viewportTop: getElementViewportTop(element, viewport) } : null;
  }

  #handleContentChange(): void {
    const content = this.#content;
    if (!content) return;
    const items = getMessageScrollerItems(content, this.#spacer);
    const previousCount = this.#itemCount;
    const previousFirst = this.#firstItem;
    this.#itemCount = items.length;
    this.#firstItem = items[0] ?? null;
    this.#reconcileContent(items, previousCount, previousFirst);
    this.#capturePrependAnchor();
  }

  // Branch order is load-bearing: first content, prepend, append, same-count update.
  #reconcileContent(items: HTMLElement[], previousCount: number, previousFirst: HTMLElement | null): void {
    if (this.#flushPendingTarget()) return;
    if (previousCount === 0) {
      if (this.#applyDefaultScrollPosition()) return;
      if (items.length > 0 && this.#options.autoScroll && this.scrollToEnd()) return;
      this.#commitScrollState();
      this.#scheduleVisibilitySync();
      return;
    }
    if (this.#preserveScrollOnPrepend() && previousFirst && items.indexOf(previousFirst) > 0) {
      this.#restorePrependAnchor();
      return;
    }
    if (items.length > previousCount) {
      const anchor = getNewScrollAnchor(items, previousCount);
      if (anchor) {
        // A batch of turns arriving while following keeps following instead of yanking back to the first of the batch.
        if (this.#options.autoScroll && this.#state.mode === 'following-bottom' && hasMultipleNewScrollAnchors(items, previousCount)) {
          this.scrollToEnd();
          return;
        }
        this.#anchorTo(anchor);
        this.#handledAnchors.add(anchor);
        return;
      }
    }
    if (items.length === previousCount) {
      const anchor = getUnanchoredScrollAnchor(items, this.#handledAnchors);
      if (anchor) {
        this.#anchorTo(anchor);
        this.#handledAnchors.add(anchor);
        return;
      }
    }
    if (this.#state.mode === 'following-bottom' && this.#options.autoScroll) {
      this.scrollToEnd();
    } else {
      this.#commitScrollState();
      this.#scheduleVisibilitySync();
    }
  }

  #handleResize(): void {
    if (this.#state.mode === 'following-bottom' && this.#options.autoScroll) {
      this.scrollToEnd();
      return;
    }
    // Hold the anchored turn as content below it resizes, or the browser clamps scrollTop and the turn drops.
    const state = this.#state;
    if (state.mode === 'anchored-to-message' && state.turn.isConnected) {
      const previousSpacerHeight = this.#spacerHeight;
      if (this.#anchorTo(state.turn)) {
        // Once the reply has consumed the whole tail spacer the reader is at the live edge, so follow takes over.
        // Requiring the > 0 to 0 transition keeps a turn taller than the viewport (placed with no spacer) held.
        if (this.#options.autoScroll && previousSpacerHeight > 0 && this.#spacerHeight === 0) this.scrollToEnd();
        return;
      }
    }
    this.#scheduleStateCommit();
    this.#scheduleVisibilitySync();
  }

  // A deliberate gesture releases follow, the anchored hold and an in-flight jump so re-pinning never fights the reader.
  #userScrollIntent(): void {
    if (this.#state.mode !== 'free-scrolling') this.#state = { mode: 'free-scrolling' };
  }

  #syncAfterScroll(): void {
    this.#commitScrollState();
    this.#scheduleVisibilitySync();
    this.#capturePrependAnchor();
  }
}

const [getMessageScroller, setMessageScroller, hasMessageScroller] = createContext<MessageScroller>();

export { setMessageScroller };

/** The scroller of the closest `Provider`. Call it during component initialisation. */
export function useMessageScroller(): MessageScroller {
  if (!hasMessageScroller()) throw new Error('useMessageScroller must be used within a MessageScroller.Provider.');
  return getMessageScroller();
}
