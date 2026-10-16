// Adapted from shadcn-ui/ui d75a96ab; MIT: apps/docs/registry/THIRD_PARTY_NOTICES.md.
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
export const emptyMediaVariants = cva('cn-empty-media flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0', {
  variants: { variant: { default: 'cn-empty-media-default', icon: 'cn-empty-media-icon' } },
  defaultVariants: { variant: 'default' },
});
export type EmptyMediaVariants = VariantProps<typeof emptyMediaVariants>;
