<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarContentProps } from './types.js';
  let { children, class: classProp, ...props }: SidebarContentProps = $props();
</script>
<div data-slot="sidebar-content" data-sidebar="content" {...props} class={cn('cn-sidebar-content flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden', classProp)}>
  {@render children?.()}
</div>
