<script lang="ts">
  import type { HTMLThAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLThAttributes = $props();
</script>
<th data-slot="table-head" {...props} class={cn('cn-table-head cn-table-head-aria', classProp)}>
  {@render children?.()}
</th>
