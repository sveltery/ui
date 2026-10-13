<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="drawer-footer" {...props} class={cn('cn-drawer-footer-base mt-auto flex shrink-0 flex-col', classProp)}>
  {@render children?.()}
</div>
