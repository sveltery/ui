import { createContext, untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { SvelteSet } from 'svelte/reactivity';
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
   * markup and the first client render agree, and nothing reads a server-side derived before every item registered.
   */
  settled = $state(false);
  // Sets mutate in place. Effect teardowns read state as it was before the change, so reassigning a filtered array
  // from an unregister would drop an item registered in the same flush.
  readonly #items = new SvelteSet<ItemModel>();
  readonly #groups = new SvelteSet<GroupModel>();
  #search = $state.raw<SearchSource>();
  /** `#search` without reactivity, for the unlink, which runs in a teardown. */
  #linked: SearchSource | undefined;
  /** Bumped when nodes move inside Root, since document order is not otherwise reactive. */
  #layout = $state(0);
  #byElement = new WeakMap<Element, ItemModel>();
  #lastSearch: string | undefined;
  #scroll = true;

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

  #view = $derived.by(() => {
    void this.#layout;
    return rank({
      items: inDocumentOrder([...this.#items]),
      groups: inDocumentOrder([...this.#groups]),
      search: this.search,
      filter: this.#options.shouldFilter ? (this.#options.filter ?? defaultFilter) : null
    });
  });
  /** Exactly one item: the first in visual order whose value is the bound value. */
  #selected = $derived.by(() => {
    const key = this.value.trim();
    return key === '' ? undefined : this.#view.ordered.find((item) => item.value === key);
  });

  get view(): View<ItemModel, GroupModel> | undefined {
    return this.settled ? this.#view : undefined;
  }
  get selectedItem(): ItemModel | undefined {
    return this.settled ? this.#selected : undefined;
  }

  readonly state: CommandState = stateOf(this);

  register(item: ItemModel): void {
    this.#items.add(item);
  }
  unregister(item: ItemModel): void {
    this.#items.delete(item);
  }
  registerGroup(group: GroupModel): void {
    this.#groups.add(group);
  }
  unregisterGroup(group: GroupModel): void {
    this.#groups.delete(group);
  }
  /** Input's bindable value is the search. Returns the unlink. */
  linkSearch(source: SearchSource): () => void {
    this.#search = this.#linked = source;
    return () => {
      if (this.#linked !== source) return;
      this.#search = this.#linked = undefined;
    };
  }
  /** Lets Root's mutation observer re-measure the item that owns a changed node. */
  observe(element: Element, item: ItemModel): () => void {
    this.#byElement.set(element, item);
    return () => this.#byElement.delete(element);
  }

  /** The only writer of the selected value. */
  pick(value: string, scroll: boolean): void {
    if (value === this.value) return;
    this.#scroll = scroll;
    this.#options.value = value;
    this.#options.onValueChange?.(value);
  }

  /** A new search selects the first item, and so does a bound value that names no visible item. */
  reconcile(): void {
    if (!this.settled) return;
    const view = this.#view;
    const search = this.search;
    const selected = this.#selected;
    untrack(() => {
      const searched = this.#lastSearch !== undefined && this.#lastSearch !== search;
      this.#lastSearch = search;
      const first = view.navigable[0]?.value;
      if (searched) this.pick(first ?? '', true);
      else if (!selected && first !== undefined) this.pick(first, true);
    });
  }

  /** Scrolls a keyboard or automatic selection into view, with its group heading when it leads its group. */
  followSelection(): void {
    const item = this.selectedItem;
    untrack(() => {
      if (!item || !this.#scroll) return;
      const leader = item.group && this.#view.ordered.find((entry) => entry.group === item.group);
      if (leader === item) item.group?.headingElement?.scrollIntoView?.({ block: 'nearest' });
      item.element?.scrollIntoView?.({ block: 'nearest' });
    });
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
    if (item?.value) this.pick(item.value, true);
  }

  attach: Attachment<HTMLElement> = (element) => {
    const observer = new MutationObserver((records) => {
      let moved = false;
      for (const record of records) {
        if (record.type === 'childList') moved = true;
        const target = record.target instanceof Element ? record.target : record.target.parentElement;
        const owner = target?.closest('[cmdk-item]');
        if (owner) this.#byElement.get(owner)?.measure();
      }
      if (moved) this.#layout += 1;
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
      return root.view?.count ?? 0;
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
