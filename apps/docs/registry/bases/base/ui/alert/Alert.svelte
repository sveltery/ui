<script lang="ts">
  // Native pinned shadcn Alert contract; MIT and provenance: tests/reference/alert-sources.json.
  import type { AlertProps } from './types.js';
  import { classes } from '../shared/classes.js';
  import { alertVariants } from './variants.js';
  let { children, class: classProp, ref = $bindable(), variant, ...props }: AlertProps = $props();
</script>
<div data-slot="alert" role="alert" {...props} class={classes(alertVariants({ variant }), classProp)} bind:this={ref}>
  {@render children?.()}
</div>
