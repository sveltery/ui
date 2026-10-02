<script lang="ts">
  // Derived from pinned shadcn Table; see tests/reference/table-sources.json and MIT notices.
  import type { Snippet } from 'svelte';
  import type { HTMLTdAttributes } from 'svelte/elements';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: Omit<HTMLTdAttributes, 'children'> & { children?: Snippet; ref?: HTMLTableCellElement | null } = $props();
</script>
<td data-slot="table-cell" {...props} class={classes('cn-table-cell', classProp)} bind:this={ref}>
  {@render children?.()}
</td>
