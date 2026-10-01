<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { classes } from './classes.js';
  let { children, class: classProp, ref = $bindable(null), ...props }: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { children?: Snippet; ref?: HTMLDivElement | null; } = $props();
</script>
<div data-slot="dialog-header" {...props} class={classes('cn-dialog-header flex flex-col', classProp)} bind:this={ref}>
  {@render children?.()}
</div>
