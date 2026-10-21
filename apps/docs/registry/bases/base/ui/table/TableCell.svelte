<script lang="ts">
  import type { HTMLTdAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLTdAttributes = $props();
</script>
<td data-slot="table-cell" {...props} class={cn('cn-table-cell cn-table-cell-aria', classProp)}>
  {@render children?.()}
</td>
