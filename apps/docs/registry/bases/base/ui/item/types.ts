import type { HTMLAttributes } from 'svelte/elements';
import type { RenderSnippet } from '../shared/render.js';
import type { SeparatorProps } from '../separator/index.js';
import type { ItemMediaVariants, ItemVariants } from './variants.js';

type NativeItemProps = HTMLAttributes<HTMLDivElement>;

export type ItemState = { slot: 'item'; variant: ItemVariants['variant']; size: ItemVariants['size'] };
export type ItemProps = NativeItemProps & ItemVariants & { render?: RenderSnippet<ItemState, HTMLDivElement> };
export type ItemGroupProps = NativeItemProps;
export type ItemSeparatorProps = SeparatorProps;
export type ItemMediaProps = NativeItemProps & ItemMediaVariants;
export type ItemContentProps = NativeItemProps;
export type ItemTitleProps = NativeItemProps;
export type ItemDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type ItemActionsProps = NativeItemProps;
export type ItemHeaderProps = NativeItemProps;
export type ItemFooterProps = NativeItemProps;
