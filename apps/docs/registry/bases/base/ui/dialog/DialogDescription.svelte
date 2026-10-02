<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import * as Primitive from '@sveltery/base/dialog';
  import { classes } from '../shared/classes.js';
  let { children, ref = $bindable(), class: classProp, ...props }: ComponentProps<typeof Primitive.Description> = $props();
</script>
<Primitive.Description data-slot="dialog-description" {children} {...props} class={classes('cn-dialog-description', classProp)} bind:ref />
