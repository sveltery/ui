<script lang="ts">
  import type { AlertProps } from './types.js';
  import { classes } from '../shared/classes.js';
  import { alertVariants } from './variants.js';
  let { children, class: classProp, ref = $bindable(), variant, ...props }: AlertProps = $props();
</script>
<div data-slot="alert" role="alert" {...props} class={classes(alertVariants({ variant }), classProp)} bind:this={ref}>
  {@render children?.()}
</div>
