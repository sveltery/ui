// Adapted from shadcn-ui/ui d75a96ab; MIT: packages/ui/THIRD_PARTY_NOTICES.md.
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
export const sidebarMenuButtonVariants = cva(
  'cn-sidebar-menu-button peer/menu-button group/menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate',
  {
    variants: {
      variant: { default: 'cn-sidebar-menu-button-variant-default', outline: 'cn-sidebar-menu-button-variant-outline' },
      size: { default: 'cn-sidebar-menu-button-size-default', sm: 'cn-sidebar-menu-button-size-sm', lg: 'cn-sidebar-menu-button-size-lg' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);
export type SidebarMenuButtonVariants = VariantProps<typeof sidebarMenuButtonVariants>;
