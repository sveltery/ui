import type { HTMLInputAttributes } from 'svelte/elements';

export type NativeCheckboxProps = Omit<HTMLInputAttributes, 'type'> & { type?: 'checkbox' };
