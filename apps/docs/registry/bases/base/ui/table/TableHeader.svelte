<script lang="ts">
  // Derived from pinned shadcn Table; see tests/reference/table-sources.json and MIT notices.
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: Omit<HTMLAttributes<HTMLTableSectionElement>, 'children'> & { children?: Snippet; ref?: HTMLTableSectionElement | null } = $props();
</script>
<thead data-slot="table-header" {...props} class={classes('cn-table-header', classProp)} bind:this={ref}>
  {@render children?.()}
</thead>
