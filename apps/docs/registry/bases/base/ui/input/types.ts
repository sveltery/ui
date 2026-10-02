// Local named type for the pinned native-input declaration, adapted to Svelte events/refs.
import type { HTMLInputAttributes } from 'svelte/elements';
// clsx's any-valued dictionary structurally accepts functions. Use unknown-valued
// static dictionaries so this native wrapper does not advertise state callbacks.
type StaticClass = string | number | boolean | null | undefined | StaticClass[] | { [name: string]: unknown };
export type InputProps = Omit<HTMLInputAttributes, 'children' | 'class'> & {
  class?: string | StaticClass[] | { [name: string]: unknown } | null;
  ref?: HTMLInputElement | null;
};
