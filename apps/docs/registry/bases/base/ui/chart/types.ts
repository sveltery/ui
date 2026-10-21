import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ChartPoint } from '@tanstack/charts';
import type { ChartDefinition, ChartTooltipBodySnippetContext } from '@tanstack/charts/svelte';
import type { ChartConfig } from './context.js';

export type { ChartConfig };

export type ChartContainerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  config: ChartConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  definition: ChartDefinition<any, any, any>;
  ariaLabel?: string;
  /** Rendered inside TanStack's tooltip surface, usually a `ChartTooltipContent`. */
  tooltip?: Snippet<[ChartTooltipBodySnippetContext]>;
  /** Rendered below the plot, usually a `ChartLegendContent`. */
  legend?: Snippet;
  initialWidth?: number;
};

export type ChartTooltipFormatter = Snippet<[value: unknown, name: string, point: ChartPoint, index: number]>;

export type ChartTooltipContentProps = ChartTooltipBodySnippetContext & {
  class?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
  nameKey?: string;
  labelKey?: string;
  labelClassName?: string;
  labelFormatter?: (value: unknown, points: readonly ChartPoint[]) => unknown;
  color?: string;
  formatter?: ChartTooltipFormatter;
};

export type ChartLegendContentProps = {
  class?: string;
  hideIcon?: boolean;
  /** Config keys to list, in order. Defaults to every key with a color. */
  keys?: readonly string[];
  verticalAlign?: 'top' | 'bottom';
};
