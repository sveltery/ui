<script lang="ts">
  // Derived from pinned shadcn Label; see tests/reference/label-sources.json and MIT notices.
  import type { Snippet } from 'svelte';
  import type { HTMLLabelAttributes } from 'svelte/elements';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: Omit<HTMLLabelAttributes, 'children'> & { children?: Snippet; ref?: HTMLLabelElement | null } = $props();
</script>
<label data-slot="label" {...props} class={classes('cn-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed', classProp)} bind:this={ref}>
  {@render children?.()}
</label>
