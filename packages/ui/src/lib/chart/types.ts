import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { TooltipSeries } from 'layerchart';

import type { ChartConfig, ChartRow } from './context.js';

export type { ChartConfig };

export type ChartContainerProps = HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
};

export type ChartTooltipFormatterArgs = {
  /** The tooltip row: series key, value, color and visibility. */
  item: TooltipSeries;
  /** The hovered data row. */
  data: ChartRow;
  index: number;
  /** The config label, then the series label. */
  name: string;
  value: unknown;
};

export type ChartTooltipContentProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'color'> & {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'dot' | 'line' | 'dashed';
  /** Data field holding the config key of each tooltip row, for charts whose series key is not the config key. */
  nameKey?: string;
  /** Config key (or data field holding one) whose label becomes the header. */
  labelKey?: string;
  /** Header text. A config key is replaced by its label. */
  label?: string;
  // Method syntax keeps the parameter bivariant, so `(value: Date) => string` is accepted for a date axis.
  labelFormatter?(value: unknown, items: TooltipSeries[]): string | number;
  /** Replaces a row's content. */
  formatter?: Snippet<[ChartTooltipFormatterArgs]>;
  /** Indicator color for every row. */
  color?: string;
  labelClass?: string;
};

export type ChartTooltipProps = ChartTooltipContentProps & {
  /** Replaces `ChartTooltipContent`. */
  children?: Snippet<[{ data: ChartRow }]>;
};

export type ChartLegendContentProps = HTMLAttributes<HTMLDivElement> & {
  hideIcon?: boolean;
  /** Data field naming each legend item, for charts whose items are rows (pie, radial) instead of series. */
  nameKey?: string;
  verticalAlign?: 'top' | 'bottom';
};

export type ChartLegendProps = ChartLegendContentProps & {
  children?: Snippet;
};
