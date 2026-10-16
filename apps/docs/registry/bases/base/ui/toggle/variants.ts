// Adapted from shadcn-ui/ui d75a96ab; MIT: apps/docs/registry/THIRD_PARTY_NOTICES.md.
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
export const toggleVariants = cva('cn-toggle group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none hover:bg-muted focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0', {
  variants: {
    variant: { default: 'cn-toggle-variant-default', outline: 'cn-toggle-variant-outline' },
    size: { default: 'cn-toggle-size-default', sm: 'cn-toggle-size-sm', lg: 'cn-toggle-size-lg' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});
export type ToggleVariants = VariantProps<typeof toggleVariants>;
