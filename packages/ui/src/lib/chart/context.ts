import { createContext, type Component } from 'svelte';
import type { ChartState } from 'layerchart';

export type ChartConfig = Record<
  string,
  { label?: string; icon?: Component } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: { light: string; dark: string } }
  )
>;

export type ChartRow = Record<string, unknown>;

export type ChartContainerContext = {
  readonly config: ChartConfig;
  /** Called by `ChartTooltip` so the container can drive its tooltip from the keyboard. Returns the cleanup. */
  registerTooltip(chart: ChartState<ChartRow>): () => void;
};

export const [getChartContainer, setChartContainer] = createContext<ChartContainerContext>();

/** The config key for a series or data row. A row field named by `key` wins when it holds a config key (`nameKey="browser"` on `{ browser: 'chrome' }`). */
export function configKey(config: ChartConfig, row: ChartRow | null, key: string): string {
  const value = row?.[key];
  return typeof value === 'string' && value in config ? value : key;
}

/** The CSS color for a config key: the per-chart variable when the config defines a color, otherwise nothing. */
export function configColor(config: ChartConfig, key: string): string | undefined {
  const entry = config[key];
  return entry?.color || entry?.theme ? `var(--color-${key})` : undefined;
}
