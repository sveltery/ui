// Adapted from shadcn-ui/ui d75a96ab; MIT: apps/docs/registry/THIRD_PARTY_NOTICES.md.
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
export const itemVariants = cva('cn-item group/item flex w-full flex-wrap items-center transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors', {
  variants: {
    variant: { default: 'cn-item-variant-default', outline: 'cn-item-variant-outline', muted: 'cn-item-variant-muted' },
    size: { default: 'cn-item-size-default', sm: 'cn-item-size-sm', xs: 'cn-item-size-xs' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});
export const itemMediaVariants = cva('cn-item-media flex shrink-0 items-center justify-center [&_svg]:pointer-events-none', {
  variants: {
    variant: { default: 'cn-item-media-variant-default', icon: 'cn-item-media-variant-icon', image: 'cn-item-media-variant-image' },
  },
  defaultVariants: { variant: 'default' },
});
export type ItemVariants = VariantProps<typeof itemVariants>;
export type ItemMediaVariants = VariantProps<typeof itemMediaVariants>;
