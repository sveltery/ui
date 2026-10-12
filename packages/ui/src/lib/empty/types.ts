import type { HTMLAttributes } from 'svelte/elements';

type NativeEmptyProps = HTMLAttributes<HTMLDivElement>;

export type EmptyProps = NativeEmptyProps;
export type EmptyHeaderProps = NativeEmptyProps;
export type EmptyTitleProps = NativeEmptyProps;
export type EmptyDescriptionProps = NativeEmptyProps;
export type EmptyContentProps = NativeEmptyProps;
export type EmptyMediaProps = NativeEmptyProps & { variant?: 'default' | 'icon' | null };
