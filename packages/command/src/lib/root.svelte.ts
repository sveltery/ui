import { createContext, untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { SvelteMap } from 'svelte/reactivity';
import { commandScore } from './command-score.js';
import type { GroupModel, ItemModel } from './item.svelte.js';
import { rank, step, stepGroup, type CommandFilter, type View } from './rank.js';
import type { CommandState } from './types.js';
import { inDocumentOrder } from './utils.js';

/** cmdk's default filter: `commandScore` over the value and its keywords. */
export const defaultFilter: CommandFilter = (value, search, keywords) => commandScore(value, search, keywords);

export interface RootOptions {
  readonly id: string;
  readonly shouldFilter: boolean;
  readonly filter: CommandFilter | undefined;
  readonly loop: boolean;
  readonly disablePointerSelection: boolean;
  readonly vimBindings: boolean;
  /** Reads and writes Root's bindable `value`. */
  value: string;
  readonly onValueChange: ((value: string) => void) | undefined;
}

export interface SearchSource {
  readonly value: string;
}

export class CommandModel {
  readonly #options: RootOptions;
  readonly ids: { readonly label: string; readonly input: string; readonly list: string };
  /**
   * False on the server and until Root mounts. Until then nothing is filtered, reordered or selected, so the server
   * markup and the first client render agree.
   */
  settled = $state(false);
  // Maps mutate in place. Effect teardowns read state as it was before the change, so reassigning a filtered copy
  // from an unregister would drop an entry registered in the same flush.
  readonly #items = new SvelteMap<ItemModel, Element>();
  readonly #groups = new SvelteMap<GroupModel, Element>();
  #search = $state.raw<SearchSource>();
  /** `#search` without reactivity, for the unlink, which runs in a teardown. */
  #linked: SearchSource | undefined;
  /** Bumped when nodes move inside Root, since document order is not otherwise reactive. */
  #layout = $state(0);
  #lastSearch: string | undefined;
  /** The picked item. With duplicate values, it tells which of the items that share the bound value is selected. */
  #current = $state.raw<ItemModel>();
  /**
   * The view's count as of the last reconcile, undefined before. Svelte re-runs `{#if}` blocks eagerly whenever an
   * effect writes state they read, so a block that read the view itself would rank the list again after each of the
   * items that register in one flush.
   */
  count = $state<number>();
  /** Set by a keyboard move or a new search, and consumed once that item is scrolled into view. */
  #scrollRequest = $state.raw<{ readonly item: ItemModel }>();

  constructor(options: RootOptions) {
    this.#options = options;
    this.ids = { label: `${options.id}-label`, input: `${options.id}-input`, list: `${options.id}-list` };
  }

  get search(): string {
    return this.#search?.value ?? '';
  }
  get value(): string {
    return this.#options.value ?? '';
  }
  get disablePointerSelection(): boolean {
    return this.#options.disablePointerSelection;
  }

  // Split from the ranking so a keystroke does not sort by document position again.
  #ordered = $derived.by(() => {
    void this.#layout;
    return { items: inDocumentOrder(this.#items), groups: inDocumentOrder(this.#groups) };
  });
  #view = $derived.by(() =>
    rank({ ...this.#ordered, search: this.search, filter: this.#options.shouldFilter ? (this.#options.filter ?? defaultFilter) : null })
  );
  /** The picked item while it still has the bound value, else the first item in visual order that has it. */
  #selected = $derived.by(() => {
    const value = this.value.trim();
    if (value === '') return undefined;
    const current = this.#current;
    if (current?.value === value && this.#view.visibleItems.has(current)) return current;
    return this.#view.ordered.find((item) => item.value === value);
  });

  get view(): View<ItemModel, GroupModel> | undefined {
    return this.settled ? this.#view : undefined;
  }
  get selectedItem(): ItemModel | undefined {
    return this.settled ? this.#selected : undefined;
  }

  readonly state: CommandState = stateOf(this);

  /** Returns the unregister. */
  register(item: ItemModel, element: Element): () => void {
    this.#items.set(item, element);
    return () => this.#items.delete(item);
  }
  /** Returns the unregister. */
  registerGroup(group: GroupModel, element: Element): () => void {
    this.#groups.set(group, element);
    return () => this.#groups.delete(group);
  }
  /** Input's bindable value is the search. Returns the unlink. */
  linkSearch(source: SearchSource): () => void {
    this.#search = this.#linked = source;
    return () => {
      if (this.#linked !== source) return;
      this.#search = this.#linked = undefined;
    };
  }

  /** The only writer of the selection. */
  pick(item: ItemModel | undefined, scroll: boolean): void {
    this.#current = item;
    if (scroll && item) this.#scrollRequest = { item };
    const value = item?.value ?? '';
    if (value === this.value) return;
    this.#options.value = value;
    this.#options.onValueChange?.(value);
  }

  /**
   * Selects the first item when the search changed, when nothing is selected, or when the picked item unmounted or
   * was filtered out. A value that names no item is otherwise kept, for an item that has not mounted yet.
   */
  reconcile(): void {
    if (!this.settled) return;
    // Text that renders the search changed in this same flush, before the mutation observer can report it.
    untrack(() => this.#measure());
    const view = this.#view;
    const search = this.search;
    const value = this.value;
    const selected = this.#selected;
    untrack(() => {
      const searched = this.#lastSearch !== undefined && this.#lastSearch !== search;
      this.#lastSearch = search;
      this.count = view.count;
      const lost = this.#current !== undefined && !view.visibleItems.has(this.#current);
      if (searched || lost || value.trim() === '') this.pick(view.navigable[0], searched);
      else this.#current = selected;
    });
  }

  /** Scrolls the item a keyboard move or a new search picked into view, with its group heading when it leads its group. */
  followSelection(): void {
    const request = this.#scrollRequest;
    if (!request) return;
    const item = this.selectedItem;
    untrack(() => {
      this.#scrollRequest = undefined;
      if (request.item !== item) return;
      const leader = item.group && this.#view.ordered.find((entry) => entry.group === item.group);
      if (leader === item) item.group?.headingElement?.scrollIntoView?.({ block: 'nearest' });
      item.element?.scrollIntoView?.({ block: 'nearest' });
    });
  }

  #measure(): void {
    for (const item of this.#items.keys()) item.measure();
  }

  keydown(event: KeyboardEvent): void {
    // keyCode 229 marks a key that an input method editor is handling.
    if (event.defaultPrevented || event.isComposing || event.keyCode === 229 || !this.settled) return;
    const vim = this.#options.vimBindings && event.ctrlKey;
    switch (event.key) {
      case 'n':
      case 'j':
        if (vim) this.#move(event, 1);
        break;
      case 'ArrowDown':
        this.#move(event, 1);
        break;
      case 'p':
      case 'k':
        if (vim) this.#move(event, -1);
        break;
      case 'ArrowUp':
        this.#move(event, -1);
        break;
      case 'Home':
        event.preventDefault();
        this.#go(this.#view.navigable[0]);
        break;
      case 'End':
        event.preventDefault();
        this.#go(this.#view.navigable.at(-1));
        break;
      case 'Enter':
        event.preventDefault();
        this.#selected?.activate();
    }
  }

  #move(event: KeyboardEvent, delta: 1 | -1): void {
    event.preventDefault();
    const view = this.#view;
    const loop = this.#options.loop;
    if (event.metaKey) this.#go(delta > 0 ? view.navigable.at(-1) : view.navigable[0]);
    else if (event.altKey) this.#go(stepGroup(view, this.#selected, delta, loop));
    else this.#go(step(view.navigable, this.#selected, delta, loop));
  }

  #go(item: ItemModel | undefined): void {
    if (item) this.pick(item, true);
  }

  attach: Attachment<HTMLElement> = (element) => {
    this.settled = true;
    const observer = new MutationObserver((records) => {
      this.#measure();
      if (records.some((record) => record.type === 'childList')) this.#layout += 1;
    });
    observer.observe(element, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  };
}

function stateOf(root: CommandModel): CommandState {
  return {
    get search() {
      return root.search;
    },
    get value() {
      return root.value;
    },
    get count() {
      return root.count ?? 0;
    },
    get selectedId() {
      return root.selectedItem?.id;
    }
  };
}

export const [getCommand, setCommand] = createContext<CommandModel>();

/** Reads the command menu's state from any descendant of Root. */
export function getCommandState(): CommandState {
  return getCommand().state;
}
