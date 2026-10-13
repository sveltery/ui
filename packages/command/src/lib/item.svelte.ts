import { createContext } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { GroupEntry, ItemEntry } from './rank.js';
import type { CommandModel } from './root.svelte.js';

export interface ItemOptions {
  readonly id: string;
  readonly value: string | undefined;
  readonly keywords: readonly string[] | undefined;
  readonly disabled: boolean;
  readonly forceMount: boolean | undefined;
  readonly onSelect: ((value: string) => void) | undefined;
}

export class ItemModel implements ItemEntry<GroupModel> {
  readonly root: CommandModel;
  readonly group: GroupModel | undefined;
  readonly #options: ItemOptions;
  element = $state.raw<HTMLElement>();
  /** The text content, measured once the element exists and again whenever Root sees it change. */
  #text = $state<string>();

  constructor(root: CommandModel, group: GroupModel | undefined, options: ItemOptions) {
    this.root = root;
    this.group = group;
    this.#options = options;
  }

  get id(): string {
    return this.#options.id;
  }
  get disabled(): boolean {
    return this.#options.disabled;
  }
  get forceMount(): boolean {
    return this.#options.forceMount ?? this.group?.forceMount ?? false;
  }

  value = $derived.by(() => (this.#options.value ?? this.#text)?.trim());
  keywords = $derived.by(() => (this.#options.keywords ?? []).map((keyword) => keyword.trim()));
  hidden = $derived.by(() => (this.root.view ? !this.root.view.visibleItems.has(this) : false));
  slot = $derived.by(() => this.root.view?.itemSlot.get(this));
  selected = $derived.by(() => this.root.selectedItem === this);

  /** Re-reads the text content. Root's mutation observer calls this when the item's text changes. */
  measure(): void {
    if (this.element) this.#text = this.element.textContent;
  }

  activate(): void {
    const value = this.value;
    if (this.disabled || !value) return;
    this.root.pick(value, false);
    this.#options.onSelect?.(value);
  }

  hover(): void {
    if (this.disabled || this.root.disablePointerSelection || !this.value) return;
    this.root.pick(this.value, false);
  }

  attach: Attachment<HTMLElement> = (element) => {
    this.element = element;
    // Reading `this.element` back here would make the attachment depend on its own write and re-run.
    this.#text = element.textContent;
    const forget = this.root.observe(element, this);
    return () => {
      forget();
      this.element = undefined;
    };
  };
}

export interface GroupOptions {
  readonly forceMount: boolean;
}

export class GroupModel implements GroupEntry {
  readonly root: CommandModel;
  readonly #options: GroupOptions;
  element = $state.raw<HTMLElement>();
  headingElement = $state.raw<HTMLElement>();

  constructor(root: CommandModel, options: GroupOptions) {
    this.root = root;
    this.#options = options;
  }

  get forceMount(): boolean {
    return this.#options.forceMount;
  }

  hidden = $derived.by(() => (this.root.view ? !this.root.view.visibleGroups.has(this) : false));
  slot = $derived.by(() => this.root.view?.groupSlot.get(this));

  attach: Attachment<HTMLElement> = (element) => {
    this.element = element;
    return () => {
      this.element = undefined;
    };
  };

  attachHeading: Attachment<HTMLElement> = (element) => {
    this.headingElement = element;
    return () => {
      this.headingElement = undefined;
    };
  };
}

export const [getGroup, setGroup, hasGroup] = createContext<GroupModel>();
