<script lang="ts">
  // Native pinned shadcn Kbd/Nova contract; see tests/reference/kbd-sources.json.
  import type { KbdProps } from './types.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: KbdProps = $props();
</script>
<kbd data-slot="kbd" {...props} class={classes('cn-kbd pointer-events-none inline-flex items-center justify-center select-none', classProp)} bind:this={ref}>
  {@render children?.()}
</kbd>
