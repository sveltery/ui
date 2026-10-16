<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLTableSectionElement> = $props();
</script>
<tfoot data-slot="table-footer" {...props} class={cn('cn-table-footer', classProp)}>
  {@render children?.()}
</tfoot>
