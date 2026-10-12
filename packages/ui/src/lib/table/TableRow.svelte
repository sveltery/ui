<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLTableRowElement> = $props();
</script>
<tr data-slot="table-row" {...props} class={cn('cn-table-row has-aria-expanded:bg-muted/50', classProp)}>
  {@render children?.()}
</tr>
