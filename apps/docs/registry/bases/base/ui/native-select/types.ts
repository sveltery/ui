import type { HTMLOptgroupAttributes, HTMLOptionAttributes, HTMLSelectAttributes } from 'svelte/elements';

export type NativeSelectProps = Omit<HTMLSelectAttributes, 'size'> & { size?: 'sm' | 'default' };
export type NativeSelectOptionProps = HTMLOptionAttributes;
export type NativeSelectOptGroupProps = HTMLOptgroupAttributes;
