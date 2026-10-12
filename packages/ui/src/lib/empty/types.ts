import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

type NativeEmptyProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children?: Snippet;
  ref?: HTMLDivElement | null;
};

export type EmptyProps = NativeEmptyProps;
export type EmptyHeaderProps = NativeEmptyProps;
export type EmptyTitleProps = NativeEmptyProps;
// The pinned React annotation names paragraph props, but the rendered host is a div.
export type EmptyDescriptionProps = NativeEmptyProps;
export type EmptyContentProps = NativeEmptyProps;
export type EmptyMediaProps = NativeEmptyProps & { variant?: 'default' | 'icon' | null };
