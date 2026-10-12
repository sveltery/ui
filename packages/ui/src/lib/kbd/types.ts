import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type KbdProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  children?: Snippet;
  ref?: HTMLElement | null;
};

// Pinned KbdGroup renders kbd despite React's div annotation; type the actual host.
export type KbdGroupProps = KbdProps;
