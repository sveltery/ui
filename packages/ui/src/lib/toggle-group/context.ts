import { getContext, setContext } from 'svelte';
import type { ToggleVariants } from '../toggle/index.js';

export type ToggleGroupContextValue = {
  readonly variant: ToggleVariants['variant'];
  readonly size: ToggleVariants['size'];
  readonly spacing: number;
  readonly orientation: 'horizontal' | 'vertical';
};

const key = Symbol('toggle-group');
const outsideGroup: ToggleGroupContextValue = { variant: undefined, size: undefined, spacing: 2, orientation: 'horizontal' };

export const getToggleGroupContext = (): ToggleGroupContextValue => getContext(key) ?? outsideGroup;
export const setToggleGroupContext = (value: ToggleGroupContextValue) => setContext(key, value);
