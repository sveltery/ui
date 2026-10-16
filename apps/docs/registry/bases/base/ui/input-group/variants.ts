// Adapted from shadcn-ui/ui d75a96ab; MIT: apps/docs/registry/THIRD_PARTY_NOTICES.md.
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
export const inputGroupAddonVariants = cva('cn-input-group-addon flex cursor-text items-center justify-center select-none', {
  variants: {
    align: {
      'inline-start': 'cn-input-group-addon-align-inline-start order-first',
      'inline-end': 'cn-input-group-addon-align-inline-end order-last',
      'block-start': 'cn-input-group-addon-align-block-start order-first w-full justify-start',
      'block-end': 'cn-input-group-addon-align-block-end order-last w-full justify-start',
    },
  },
  defaultVariants: { align: 'inline-start' },
});
export const inputGroupButtonVariants = cva('cn-input-group-button flex items-center shadow-none', {
  variants: {
    size: {
      xs: 'cn-input-group-button-size-xs',
      sm: 'cn-input-group-button-size-sm',
      'icon-xs': 'cn-input-group-button-size-icon-xs',
      'icon-sm': 'cn-input-group-button-size-icon-sm',
    },
  },
  defaultVariants: { size: 'xs' },
});
export type InputGroupAddonVariants = VariantProps<typeof inputGroupAddonVariants>;
export type InputGroupButtonVariants = VariantProps<typeof inputGroupButtonVariants>;
