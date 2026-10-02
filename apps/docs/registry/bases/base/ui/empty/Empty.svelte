<script lang="ts">
  // Native pinned shadcn Empty/Nova contract; see tests/reference/empty-sources.json.
  import type { EmptyProps } from './types.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: EmptyProps = $props();
</script>
<div data-slot="empty" {...props} class={classes('cn-empty flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance', classProp)} bind:this={ref}>
  {@render children?.()}
</div>
