<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLTableSectionElement> = $props();
</script>
<tbody data-slot="table-body" {...props} class={cn('cn-table-body', classProp)}>
  {@render children?.()}
</tbody>
