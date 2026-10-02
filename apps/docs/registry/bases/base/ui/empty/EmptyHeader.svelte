<script lang="ts">
  // Native pinned shadcn Empty/Nova contract; see tests/reference/empty-sources.json.
  import type { EmptyHeaderProps } from './types.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: EmptyHeaderProps = $props();
</script>
<div data-slot="empty-header" {...props} class={classes('cn-empty-header flex max-w-sm flex-col items-center', classProp)} bind:this={ref}>
  {@render children?.()}
</div>
