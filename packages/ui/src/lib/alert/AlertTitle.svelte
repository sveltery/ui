<script lang="ts">
  import type { AlertTitleProps } from './types.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: AlertTitleProps = $props();
</script>
<div data-slot="alert-title" {...props} class={classes('cn-alert-title [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground', classProp)} bind:this={ref}>
  {@render children?.()}
</div>
