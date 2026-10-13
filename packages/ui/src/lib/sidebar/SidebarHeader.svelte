<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarHeaderProps } from './types.js';
  let { children, class: classProp, ...props }: SidebarHeaderProps = $props();
</script>
<div data-slot="sidebar-header" data-sidebar="header" {...props} class={cn('cn-sidebar-header flex flex-col', classProp)}>
  {@render children?.()}
</div>
