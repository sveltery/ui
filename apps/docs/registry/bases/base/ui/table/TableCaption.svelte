<script lang="ts">
  // Derived from pinned shadcn Table; see tests/reference/table-sources.json and MIT notices.
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: Omit<HTMLAttributes<HTMLElement>, 'children'> & { children?: Snippet; ref?: HTMLTableCaptionElement | null } = $props();
</script>
<caption data-slot="table-caption" {...props} class={classes('cn-table-caption', classProp)} bind:this={ref}>
  {@render children?.()}
</caption>
