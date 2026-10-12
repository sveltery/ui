// Adapted from shadcn-ui/ui d75a96ab; MIT: packages/ui/THIRD_PARTY_NOTICES.md.
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
export const markerVariants = cva('cn-marker group/marker relative flex w-full items-center', {
  variants: {
    variant: {
      default: 'cn-marker-variant-default',
      separator: 'cn-marker-variant-separator',
      border: 'cn-marker-variant-border',
    },
  },
});
export type MarkerVariants = VariantProps<typeof markerVariants>;
