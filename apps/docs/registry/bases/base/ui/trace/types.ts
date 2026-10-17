import type { ComponentProps } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../collapsible/index.js';

type NativeSpanProps = HTMLAttributes<HTMLSpanElement>;

export type TraceProps = HTMLAttributes<HTMLDivElement>;
export type TraceLineProps = NativeSpanProps & { status?: 'running' | 'error' | 'pending' };
export type TraceIconProps = NativeSpanProps;
export type TraceTitleProps = NativeSpanProps;
export type TraceDescriptionProps = NativeSpanProps;
export type TraceCollapsibleProps = ComponentProps<typeof Collapsible>;
export type TraceCollapsibleTriggerProps = ComponentProps<typeof CollapsibleTrigger>;
export type TraceCollapsibleContentProps = ComponentProps<typeof CollapsibleContent>;
