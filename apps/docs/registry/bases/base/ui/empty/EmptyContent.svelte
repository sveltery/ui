<script lang="ts">
  // Native pinned shadcn Empty/Nova contract; see tests/reference/empty-sources.json.
  import type { EmptyContentProps } from './types.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: EmptyContentProps = $props();
</script>
<div data-slot="empty-content" {...props} class={classes('cn-empty-content flex w-full max-w-sm min-w-0 flex-col items-center text-balance', classProp)} bind:this={ref}>
  {@render children?.()}
</div>
