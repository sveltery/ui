<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarMenuSubProps } from './types.js';
  let { children, class: classProp, ...props }: SidebarMenuSubProps = $props();
</script>
<ul data-slot="sidebar-menu-sub" data-sidebar="menu-sub" {...props} class={cn('cn-sidebar-menu-sub flex min-w-0 flex-col group-data-[collapsible=icon]:hidden', classProp)}>
  {@render children?.()}
</ul>
