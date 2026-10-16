<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLElement> = $props();
</script>
<caption data-slot="table-caption" {...props} class={cn('cn-table-caption', classProp)}>
  {@render children?.()}
</caption>
