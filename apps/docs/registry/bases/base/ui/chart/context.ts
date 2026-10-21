import { createContext, type Component } from 'svelte';

// Format: { THEME_NAME: CSS_SELECTOR }
export const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = Record<
  string,
  { label?: string; icon?: Component } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

type ChartContextProps = { readonly config: ChartConfig };

export const [useChart, setChart] = createContext<ChartContextProps>();

/** A TanStack color scale whose categories are config keys painted with their `--color-<key>` variables. */
export function chartColors<const TKey extends string>(keys: readonly TKey[]) {
  return { domain: keys, range: keys.map((key) => `var(--color-${key})`) };
}
