import type { HTMLAttributes } from 'svelte/elements';
import type { RenderSnippet } from '../shared/render.js';
import type { SeparatorProps } from '../separator/index.js';
import type { ButtonGroupVariants } from './variants.js';

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & ButtonGroupVariants;
export type ButtonGroupTextState = { slot: 'button-group-text' };
export type ButtonGroupTextProps = HTMLAttributes<HTMLDivElement> & { render?: RenderSnippet<ButtonGroupTextState, HTMLDivElement> };
export type ButtonGroupSeparatorProps = SeparatorProps;
