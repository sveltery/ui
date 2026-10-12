<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="sheet-footer" {...props} class={cn('cn-sheet-footer mt-auto flex flex-col', classProp)}>
  {@render children?.()}
</div>
