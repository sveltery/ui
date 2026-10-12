<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLThAttributes } from 'svelte/elements';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: Omit<HTMLThAttributes, 'children'> & { children?: Snippet; ref?: HTMLTableCellElement | null } = $props();
</script>
<th data-slot="table-head" {...props} class={classes('cn-table-head', classProp)} bind:this={ref}>
  {@render children?.()}
</th>
