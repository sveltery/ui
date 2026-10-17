import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';

export type NativeRadioGroupProps = HTMLAttributes<HTMLDivElement>;
export type NativeRadioProps = Omit<HTMLInputAttributes, 'type'> & { type?: 'radio' };
