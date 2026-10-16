<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarMenuSubItemProps } from './types.js';
  let { children, class: classProp, ...props }: SidebarMenuSubItemProps = $props();
</script>
<li data-slot="sidebar-menu-sub-item" data-sidebar="menu-sub-item" {...props} class={cn('group/menu-sub-item relative', classProp)}>
  {@render children?.()}
</li>
