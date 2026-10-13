import type { ComponentProps } from 'svelte';
import type { HTMLAnchorAttributes, HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { RenderSnippet } from '../shared/render.js';
import type { ButtonProps } from '../button/index.js';
import type { InputProps } from '@sveltery/base/input';
import type { SeparatorProps } from '../separator/index.js';
import type { TooltipContent } from '../tooltip/index.js';
import type { SidebarMenuButtonVariants } from './variants.js';

type DivProps = HTMLAttributes<HTMLDivElement>;

export type SidebarProviderProps = DivProps & {
  /** Whether the sidebar starts open. Read the `sidebar_state` cookie on the server to restore the last choice. @default true */
  defaultOpen?: boolean;
  /** Whether the desktop sidebar is expanded. Use `bind:open` to control it. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
export type SidebarProps = DivProps & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
};
export type SidebarTriggerProps = ButtonProps;
export type SidebarRailProps = HTMLButtonAttributes;
export type SidebarInsetProps = HTMLAttributes<HTMLElement>;
export type SidebarInputProps = InputProps;
export type SidebarHeaderProps = DivProps;
export type SidebarFooterProps = DivProps;
export type SidebarSeparatorProps = SeparatorProps;
export type SidebarContentProps = DivProps;
export type SidebarGroupProps = DivProps;
export type SidebarGroupContentProps = DivProps;
export type SidebarMenuProps = HTMLAttributes<HTMLUListElement>;
export type SidebarMenuItemProps = HTMLAttributes<HTMLLIElement>;
export type SidebarMenuBadgeProps = DivProps;
export type SidebarMenuSkeletonProps = DivProps & { showIcon?: boolean };
export type SidebarMenuSubProps = HTMLAttributes<HTMLUListElement>;
export type SidebarMenuSubItemProps = HTMLAttributes<HTMLLIElement>;

export type SidebarGroupLabelState = { slot: 'sidebar-group-label' };
export type SidebarGroupLabelProps = DivProps & { render?: RenderSnippet<SidebarGroupLabelState, HTMLDivElement> };
export type SidebarGroupActionState = { slot: 'sidebar-group-action' };
export type SidebarGroupActionProps = HTMLButtonAttributes & { render?: RenderSnippet<SidebarGroupActionState, HTMLButtonElement> };
export type SidebarMenuActionState = { slot: 'sidebar-menu-action' };
export type SidebarMenuActionProps = HTMLButtonAttributes & { showOnHover?: boolean; render?: RenderSnippet<SidebarMenuActionState, HTMLButtonElement> };
export type SidebarMenuButtonState = { slot: 'sidebar-menu-button'; size: NonNullable<SidebarMenuButtonVariants['size']>; active: boolean };
export type SidebarMenuButtonProps = HTMLButtonAttributes &
  SidebarMenuButtonVariants & {
    isActive?: boolean;
    /** Shown beside the button while the sidebar is collapsed to icons. */
    tooltip?: string | ComponentProps<typeof TooltipContent>;
    render?: RenderSnippet<SidebarMenuButtonState, HTMLButtonElement>;
  };
export type SidebarMenuSubButtonState = { slot: 'sidebar-menu-sub-button'; size: 'sm' | 'md'; active: boolean };
export type SidebarMenuSubButtonProps = HTMLAnchorAttributes & { size?: 'sm' | 'md'; isActive?: boolean; render?: RenderSnippet<SidebarMenuSubButtonState, HTMLAnchorElement> };
