<script lang="ts">
  // Derived from pinned shadcn Table; see tests/reference/table-sources.json and MIT notices.
  import type { Snippet } from 'svelte';
  import type { HTMLTableAttributes } from 'svelte/elements';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: Omit<HTMLTableAttributes, 'children'> & { children?: Snippet; ref?: HTMLTableElement | null } = $props();
</script>
<div data-slot="table-container" class="cn-table-container">
  <table data-slot="table" {...props} class={classes('cn-table', classProp)} bind:this={ref}>
    {@render children?.()}
  </table>
</div>
