import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { VariantProps } from 'class-variance-authority';
import type { alertVariants } from './variants.js';
type NativeAlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { children?: Snippet; ref?: HTMLDivElement | null };
export type AlertProps = NativeAlertProps & VariantProps<typeof alertVariants>;
export type AlertTitleProps = NativeAlertProps;
export type AlertDescriptionProps = NativeAlertProps;
export type AlertActionProps = NativeAlertProps;
