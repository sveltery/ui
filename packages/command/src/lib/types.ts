import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
import type { CommandFilter } from './rank.js';

export type { CommandFilter };

export interface CommandRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible label for the command menu, rendered visually hidden. */
  label?: string;
  /** Set to false to turn off filtering and sorting, for example when the items come from a server search. */
  shouldFilter?: boolean;
  /** Scores an item against the search from 0 (hidden) to 1 (best). Defaults to `defaultFilter`. */
  filter?: CommandFilter;
  /**
   * The selected item's value. Bindable. While it is empty, Root selects the first item. A value that names no item is
   * kept, and selects the first item with that value once one mounts.
   */
  value?: string;
  /** Called on every change of the selected value, including the menu's own automatic selection. */
  onValueChange?: (value: string) => void;
  /** Wraps the arrow keys around the ends of the list. */
  loop?: boolean;
  /** Stops pointer movement from selecting items. */
  disablePointerSelection?: boolean;
  /** Enables Ctrl+N/J and Ctrl+P/K. Defaults to true. */
  vimBindings?: boolean;
}

export interface CommandInputProps extends Omit<HTMLInputAttributes, 'value' | 'type' | 'children'> {
  /** The search text. Bindable. */
  value?: string;
}

export interface CommandListProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible label for the listbox. Defaults to "Suggestions". */
  label?: string;
}

export interface CommandItemProps extends HTMLAttributes<HTMLDivElement> {
  /** The item's value. Defaults to its trimmed text content. */
  value?: string;
  /** Extra words the search matches against. */
  keywords?: readonly string[];
  disabled?: boolean;
  /** Keeps the item visible whatever the search is. */
  forceMount?: boolean;
  /** Called with the item's value on click or Enter. */
  onSelect?: (value: string) => void;
}

export interface CommandGroupProps extends HTMLAttributes<HTMLDivElement> {
  heading?: string | Snippet;
  /** The group's `data-value`. Defaults to the heading's text. */
  value?: string;
  /** Keeps the group and its items visible whatever the search is. */
  forceMount?: boolean;
}

export interface CommandSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Keeps the separator rendered while searching. */
  alwaysRender?: boolean;
}

export type CommandEmptyProps = HTMLAttributes<HTMLDivElement>;

export interface CommandLoadingProps extends HTMLAttributes<HTMLDivElement> {
  /** Loading progress from 0 to 100. */
  progress?: number;
  /** Accessible label for the progress bar. Defaults to "Loading...". */
  label?: string;
}

/** The command menu's state, read with `getCommandState()` from any descendant of Root. */
export interface CommandState {
  readonly search: string;
  readonly value: string;
  /** How many items match the search, not counting force-mounted ones. 0 until Root mounts. */
  readonly count: number;
  /** The id of the selected item element. */
  readonly selectedId: string | undefined;
}
