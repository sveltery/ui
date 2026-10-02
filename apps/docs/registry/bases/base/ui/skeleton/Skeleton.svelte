<script lang="ts">
  // Native shadcn Skeleton/Nova contract; see tests/reference/skeleton-sources.json.
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { children?: Snippet; ref?: HTMLDivElement | null } = $props();
</script>
<div data-slot="skeleton" {...props} class={classes('cn-skeleton animate-pulse', classProp)} bind:this={ref}>
  {@render children?.()}
</div>
