<script lang="ts">
  // Native pinned shadcn Empty/Nova contract; see tests/reference/empty-sources.json.
  import type { EmptyTitleProps } from './types.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: EmptyTitleProps = $props();
</script>
<div data-slot="empty-title" {...props} class={classes('cn-empty-title cn-font-heading', classProp)} bind:this={ref}>
  {@render children?.()}
</div>
