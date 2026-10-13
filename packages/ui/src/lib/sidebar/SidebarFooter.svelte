<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarFooterProps } from './types.js';
  let { children, class: classProp, ...props }: SidebarFooterProps = $props();
</script>
<div data-slot="sidebar-footer" data-sidebar="footer" {...props} class={cn('cn-sidebar-footer flex flex-col', classProp)}>
  {@render children?.()}
</div>
