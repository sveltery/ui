import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type RegisteredSeparator = {
  element: HTMLDivElement;
  id: string;
};

type BaseSeparatorAttributes = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id' | 'role' | 'style' | 'tabindex'>;

export type SeparatorProps = BaseSeparatorAttributes & {
  children?: Snippet | undefined;

  /**
   * CSS class name.
   *
   * ℹ️ Use the `data-separator` attribute for custom _hover_ and _active_ styles
   *
   * ⚠️ The following properties cannot be overridden: `flex-grow`, `flex-shrink`
   */
  class?: string | undefined;

  /**
   * The root `HTMLDivElement`. Bind it to read the element.
   */
  elementRef?: HTMLDivElement | null | undefined;

  /**
   * Uniquely identifies the separator within the parent group.
   * Falls back to `$props.id()` when not provided.
   *
   * ℹ️ This value will also be assigned to the `data-separator` attribute.
   */
  id?: string | number | undefined;

  /**
   * CSS properties.
   *
   * ℹ️ Use the `data-separator` attribute for custom _hover_ and _active_ styles
   *
   * ⚠️ The following properties cannot be overridden: `flex-grow`, `flex-shrink`
   */
  style?: string | null | undefined;
};
