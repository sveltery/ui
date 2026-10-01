<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import * as Primitive from '@sveltery/base/dialog';
  import { classes } from './classes.js';
  let { children, ref = $bindable(null), class: classProp, ...props }: ComponentProps<typeof Primitive.Title> = $props();
</script>
<Primitive.Title data-slot="dialog-title" {...props} class={classes('cn-dialog-title cn-font-heading', classProp)} bind:ref>
  {@render children?.()}
</Primitive.Title>
