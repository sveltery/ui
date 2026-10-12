import type { HTMLAttributes } from 'svelte/elements';
import type { RenderSnippet } from '../shared/render.js';
import type { MarkerVariants } from './variants.js';

export type MarkerState = { slot: 'marker'; variant: NonNullable<MarkerVariants['variant']> };
export type MarkerProps = HTMLAttributes<HTMLDivElement> & MarkerVariants & { render?: RenderSnippet<MarkerState, HTMLDivElement> };
export type MarkerIconProps = HTMLAttributes<HTMLSpanElement>;
export type MarkerContentProps = HTMLAttributes<HTMLSpanElement>;
