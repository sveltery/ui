<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import * as Primitive from '@sveltery/base/dialog';
  import { classes } from './classes.js';
  let { children, ref = $bindable(null), class: classProp, ...props }: ComponentProps<typeof Primitive.Backdrop> = $props();
</script>
<Primitive.Backdrop data-slot="dialog-overlay" {children} {...props} class={classes('cn-dialog-overlay fixed inset-0 isolate z-50', classProp)} bind:ref />
