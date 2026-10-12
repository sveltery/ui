import type { HTMLAttributes } from 'svelte/elements';
import type { RenderSnippet } from '../render.js';
import type { BadgeVariants } from './variants.js';
export type BadgeState = { slot: 'badge'; variant: NonNullable<BadgeVariants['variant']> };
export type BadgeProps = HTMLAttributes<HTMLSpanElement> & BadgeVariants & { render?: RenderSnippet<BadgeState> };
