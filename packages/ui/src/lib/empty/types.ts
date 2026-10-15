import type { HTMLAttributes } from 'svelte/elements';
import type { EmptyMediaVariants } from './variants.js';

type NativeEmptyProps = HTMLAttributes<HTMLDivElement>;

export type EmptyProps = NativeEmptyProps;
export type EmptyHeaderProps = NativeEmptyProps;
export type EmptyTitleProps = NativeEmptyProps;
export type EmptyDescriptionProps = NativeEmptyProps;
export type EmptyContentProps = NativeEmptyProps;
export type EmptyMediaProps = NativeEmptyProps & EmptyMediaVariants;
