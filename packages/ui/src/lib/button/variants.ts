// Adapted from shadcn-ui/ui d75a96ab; MIT: packages/ui/THIRD_PARTY_NOTICES.md.
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { closeBase } from '../shared/classes.js';
export const variants = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const;
export const sizes = ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const;
export const buttonVariants = cva(closeBase, {
  variants: {
    variant: {
      default: 'cn-button-variant-default', outline: 'cn-button-variant-outline',
      secondary: 'cn-button-variant-secondary', ghost: 'cn-button-variant-ghost',
      destructive: 'cn-button-variant-destructive', link: 'cn-button-variant-link',
    },
    size: {
      default: 'cn-button-size-default', xs: 'cn-button-size-xs', sm: 'cn-button-size-sm', lg: 'cn-button-size-lg',
      icon: 'cn-button-size-icon', 'icon-xs': 'cn-button-size-icon-xs', 'icon-sm': 'cn-button-size-icon-sm', 'icon-lg': 'cn-button-size-icon-lg',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});
export type ButtonVariants = VariantProps<typeof buttonVariants>;
