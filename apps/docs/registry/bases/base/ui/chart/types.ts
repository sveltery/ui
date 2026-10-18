import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { DefaultLegendContentProps, SvelteArgs, TooltipContentProps, TooltipNameType, TooltipPayloadEntry, TooltipValueType } from '@sveltery/charts';
import type { ChartConfig } from './context.js';

export type { ChartConfig };

export type ChartContainerProps = HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
  children: Snippet;
  initialDimension?: { width: number; height: number };
};

/** What a Tooltip `content` snippet receives: the Tooltip's props, less its formatter, which `ChartTooltipContent` replaces. */
export type TooltipContentArgs = Omit<SvelteArgs<TooltipContentProps>, 'formatter'>;

/** Upstream's formatter returns a node. Here it is a snippet with the same arguments. */
export type ChartTooltipFormatter = Snippet<
  [value: TooltipValueType, name: TooltipNameType, item: TooltipPayloadEntry, index: number, payload: TooltipPayloadEntry['payload']]
>;

export type ChartTooltipContentProps = TooltipContentArgs & {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
  labelClassName?: string;
  color?: string;
  formatter?: ChartTooltipFormatter;
};

export type ChartLegendContentProps = SvelteArgs<DefaultLegendContentProps> & {
  hideIcon?: boolean;
  nameKey?: string;
};
