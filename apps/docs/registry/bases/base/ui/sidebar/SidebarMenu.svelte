<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarMenuProps } from './types.js';
  let { children, class: classProp, ...props }: SidebarMenuProps = $props();
</script>
<ul data-slot="sidebar-menu" data-sidebar="menu" {...props} class={cn('cn-sidebar-menu flex w-full min-w-0 flex-col', classProp)}>
  {@render children?.()}
</ul>
