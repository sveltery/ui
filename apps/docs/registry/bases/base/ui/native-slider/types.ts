import type { HTMLInputAttributes } from 'svelte/elements';

export type NativeSliderProps = Omit<HTMLInputAttributes, 'type'> & { type?: 'range' };
