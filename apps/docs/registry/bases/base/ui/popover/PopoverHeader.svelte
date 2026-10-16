<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="popover-header" {...props} class={cn('cn-popover-header', classProp)}>
  {@render children?.()}
</div>
