<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import * as Primitive from '@sveltery/base/dialog';
  import { Button } from '../button/index.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), showCloseButton = false, ...props }: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { children?: Snippet; ref?: HTMLDivElement | null; showCloseButton?: boolean; } = $props();
</script>
<div data-slot="dialog-footer" {...props} class={classes('cn-dialog-footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', classProp)} bind:this={ref}>
  {@render children?.()}
  {#if showCloseButton}
    <Primitive.Close>
      {#snippet render(closeProps: Record<string | symbol, unknown>, _state: unknown, closeChildren: Snippet | undefined)}
        {const { tabindex, ...buttonProps } = $derived(closeProps)}
        <Button {...(tabindex === undefined ? buttonProps : closeProps)} variant="outline">{@render closeChildren?.()}</Button>
      {/snippet}
      Close
    </Primitive.Close>
  {/if}
</div>
