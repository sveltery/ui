import { createContext } from 'svelte';
import type { ToggleVariants } from '../toggle/index.js';

export type ToggleGroupContextValue = {
  readonly variant: ToggleVariants['variant'];
  readonly size: ToggleVariants['size'];
  readonly spacing: number;
};

export const [getToggleGroupContext, setToggleGroupContext, hasToggleGroupContext] = createContext<ToggleGroupContextValue>();
