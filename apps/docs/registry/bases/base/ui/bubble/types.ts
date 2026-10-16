import type { HTMLAttributes } from 'svelte/elements';
import type { RenderSnippet } from '../shared/render.js';
import type { BubbleReactionsVariants, BubbleVariants } from './variants.js';

type NativeDivProps = HTMLAttributes<HTMLDivElement>;

export type BubbleAlign = 'start' | 'end';
export type BubbleGroupProps = NativeDivProps;
export type BubbleProps = NativeDivProps & BubbleVariants & { align?: BubbleAlign };
export type BubbleContentState = { slot: 'bubble-content' };
export type BubbleContentProps = HTMLAttributes<HTMLElement> & { render?: RenderSnippet<BubbleContentState> };
export type BubbleReactionsProps = NativeDivProps & BubbleReactionsVariants & { align?: BubbleAlign };
