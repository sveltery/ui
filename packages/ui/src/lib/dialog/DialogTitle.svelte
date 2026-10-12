<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Dialog as Primitive } from '@sveltery/base/dialog';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Title> = $props();
</script>
<Primitive.Title data-slot="dialog-title" {children} {...props} class={classes('cn-dialog-title cn-font-heading', classProp)} />
