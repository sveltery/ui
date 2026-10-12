<script lang="ts">
  import type { AlertDescriptionProps } from './types.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: AlertDescriptionProps = $props();
</script>
<div data-slot="alert-description" {...props} class={classes('cn-alert-description [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground', classProp)} bind:this={ref}>
  {@render children?.()}
</div>
