<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarInsetProps } from './types.js';
  let { children, class: classProp, ...props }: SidebarInsetProps = $props();
</script>
<main data-slot="sidebar-inset" {...props} class={cn('cn-sidebar-inset relative flex w-full flex-1 flex-col', classProp)}>
  {@render children?.()}
</main>
