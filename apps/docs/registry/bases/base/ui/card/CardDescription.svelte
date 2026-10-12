<script lang="ts">
  import type { CardDescriptionProps } from './types.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: CardDescriptionProps = $props();
</script>
<div data-slot="card-description" {...props} class={classes('cn-card-description', classProp)} bind:this={ref}>
  {@render children?.()}
</div>
