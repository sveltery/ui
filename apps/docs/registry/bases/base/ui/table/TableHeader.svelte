<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLTableSectionElement> = $props();
</script>
<thead data-slot="table-header" {...props} class={cn('cn-table-header', classProp)}>
  {@render children?.()}
</thead>
