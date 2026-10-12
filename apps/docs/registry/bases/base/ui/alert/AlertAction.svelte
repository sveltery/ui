<script lang="ts">
  import type { AlertActionProps } from './types.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), ...props }: AlertActionProps = $props();
</script>
<div data-slot="alert-action" {...props} class={classes('cn-alert-action', classProp)} bind:this={ref}>
  {@render children?.()}
</div>
