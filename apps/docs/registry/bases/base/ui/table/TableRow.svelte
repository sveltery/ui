<script lang="ts">
  // Derived from pinned shadcn Table; see tests/reference/table-sources.json and MIT notices.
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> & { children?: Snippet; ref?: HTMLTableRowElement | null } = $props();
</script>
<tr data-slot="table-row" {...props} class={classes('cn-table-row has-aria-expanded:bg-muted/50', classProp)} bind:this={ref}>
  {@render children?.()}
</tr>
