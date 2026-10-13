<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarMenuItemProps } from './types.js';
  let { children, class: classProp, ...props }: SidebarMenuItemProps = $props();
</script>
<li data-slot="sidebar-menu-item" data-sidebar="menu-item" {...props} class={cn('group/menu-item relative', classProp)}>
  {@render children?.()}
</li>
