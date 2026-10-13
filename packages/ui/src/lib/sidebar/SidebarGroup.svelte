<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarGroupProps } from './types.js';
  let { children, class: classProp, ...props }: SidebarGroupProps = $props();
</script>
<div data-slot="sidebar-group" data-sidebar="group" {...props} class={cn('cn-sidebar-group relative flex w-full min-w-0 flex-col', classProp)}>
  {@render children?.()}
</div>
