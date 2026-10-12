<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="dialog-header" {...props} class={cn('cn-dialog-header flex flex-col', classProp)}>
  {@render children?.()}
</div>
