<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="drawer-header" {...props} class={cn('cn-drawer-header-base flex shrink-0 flex-col group-data-[swipe-axis=y]/drawer-popup:text-center', classProp)}>
  {@render children?.()}
</div>
