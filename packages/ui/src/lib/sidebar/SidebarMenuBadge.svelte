<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarMenuBadgeProps } from './types.js';
  let { children, class: classProp, ...props }: SidebarMenuBadgeProps = $props();
</script>
<div data-slot="sidebar-menu-badge" data-sidebar="menu-badge" {...props} class={cn('cn-sidebar-menu-badge flex items-center justify-center tabular-nums select-none group-data-[collapsible=icon]:hidden', classProp)}>
  {@render children?.()}
</div>
