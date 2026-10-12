<script lang="ts">
  // Preserve the pinned native kbd host, including its nested keyboard semantics.
  import type { KbdGroupProps } from './types.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: KbdGroupProps = $props();
</script>
<kbd data-slot="kbd-group" {...props} class={classes('cn-kbd-group inline-flex items-center', classProp)} bind:this={ref}>
  {@render children?.()}
</kbd>
