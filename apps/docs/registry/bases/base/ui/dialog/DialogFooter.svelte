<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Dialog as Primitive } from '@sveltery/base/dialog';
  import type { DialogCloseState, DialogTriggerHostProps } from '@sveltery/base/dialog';
  import { Button } from '../button/index.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, ref = $bindable(), showCloseButton = false, ...props }: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { children?: Snippet; ref?: HTMLDivElement | null; showCloseButton?: boolean; } = $props();
</script>
<div data-slot="dialog-footer" {...props} class={classes('cn-dialog-footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', classProp)} bind:this={ref}>
  {@render children?.()}
  {#if showCloseButton}
    <Primitive.Close>
      {#snippet render(closeProps: DialogTriggerHostProps, _state: DialogCloseState, closeChildren: Snippet)}
        <Button {...closeProps} variant="outline">{@render closeChildren()}</Button>
      {/snippet}
      Close
    </Primitive.Close>
  {/if}
</div>
