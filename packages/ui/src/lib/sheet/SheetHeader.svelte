<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="sheet-header" {...props} class={cn('cn-sheet-header flex flex-col', classProp)}>
  {@render children?.()}
</div>
