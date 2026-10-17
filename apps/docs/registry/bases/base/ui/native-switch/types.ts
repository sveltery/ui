import type { HTMLInputAttributes } from 'svelte/elements';

export type NativeSwitchProps = Omit<HTMLInputAttributes, 'type' | 'size'> & { type?: 'checkbox'; size?: 'sm' | 'default' };
