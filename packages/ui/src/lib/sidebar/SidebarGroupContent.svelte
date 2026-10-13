<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarGroupContentProps } from './types.js';
  let { children, class: classProp, ...props }: SidebarGroupContentProps = $props();
</script>
<div data-slot="sidebar-group-content" data-sidebar="group-content" {...props} class={cn('cn-sidebar-group-content w-full', classProp)}>
  {@render children?.()}
</div>
