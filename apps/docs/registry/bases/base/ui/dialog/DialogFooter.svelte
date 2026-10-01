<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import * as Primitive from '@sveltery/base/dialog';
  import { classes, closeBase } from './classes.js';
  let { children, class: classProp, ref = $bindable(null), showCloseButton = false, ...props }: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { children?: Snippet; ref?: HTMLDivElement | null; showCloseButton?: boolean; } = $props();
</script>
<div data-slot="dialog-footer" {...props} class={classes('cn-dialog-footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', classProp)} bind:this={ref}>
  {@render children?.()}
  {#if showCloseButton}
    <Primitive.Close class={`${closeBase} cn-button-variant-outline cn-button-size-default`}>Close</Primitive.Close>
  {/if}
</div>
