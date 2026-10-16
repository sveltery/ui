<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="skeleton" {...props} class={cn('cn-skeleton animate-pulse', classProp)}>
  {@render children?.()}
</div>
