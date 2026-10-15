import type { HTMLTextareaAttributes } from 'svelte/elements';

/** A textarea holds one value, so `value` takes what a Field control takes. */
export type TextareaProps = Omit<HTMLTextareaAttributes, 'value'> & { value?: string | number | null };
