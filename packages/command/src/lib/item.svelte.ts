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
  /** Set while the item is registered with Root. */
  element = $state.raw<HTMLElement>();
  /** The text content, measured on attach and again whenever Root re-measures. */
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
  // An unregistered item never reads the view. It renders as the server did, and items that mount together are
  // ranked once after they all registered instead of once each.
  #view = $derived.by(() => (this.element ? this.root.view : undefined));
  hidden = $derived.by(() => (this.#view ? !this.#view.visibleItems.has(this) : false));
  slot = $derived.by(() => this.#view?.itemSlot.get(this));
  selected = $derived.by(() => this.#view !== undefined && this.root.selectedItem === this);

  /** Re-reads the text an inferred value comes from. */
  measure(): void {
    if (this.element && this.#options.value === undefined) this.#text = this.element.textContent;
  }

  activate(): void {
    const value = this.value;
    if (this.disabled || !value) return;
    this.root.pick(this, false);
    this.#options.onSelect?.(value);
  }

  hover(): void {
    if (this.disabled || this.root.disablePointerSelection || !this.value) return;
    this.root.pick(this, false);
  }

  attach: Attachment<HTMLElement> = (element) => {
    // Reading `this.element` back here would make the attachment depend on its own write and re-run.
    this.#text = element.textContent;
    this.element = element;
    const unregister = this.root.register(this, element);
    return () => {
      unregister();
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
  /** Set while the group is registered with Root. */
  element = $state.raw<HTMLElement>();
  headingElement = $state.raw<HTMLElement>();

  constructor(root: CommandModel, options: GroupOptions) {
    this.root = root;
    this.#options = options;
  }

  get forceMount(): boolean {
    return this.#options.forceMount;
  }

  #view = $derived.by(() => (this.element ? this.root.view : undefined));
  hidden = $derived.by(() => (this.#view ? !this.#view.visibleGroups.has(this) : false));
  slot = $derived.by(() => this.#view?.groupSlot.get(this));

  attach: Attachment<HTMLElement> = (element) => {
    this.element = element;
    const unregister = this.root.registerGroup(this, element);
    return () => {
      unregister();
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
