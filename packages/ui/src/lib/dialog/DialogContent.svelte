<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import * as Primitive from '@sveltery/base/dialog';
  import DialogPortal from './DialogPortal.svelte';
  import DialogOverlay from './DialogOverlay.svelte';
  import { Button } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, showCloseButton = true, ref = $bindable(), ...props }: ComponentProps<typeof Primitive.Popup> & { showCloseButton?: boolean } = $props();
</script>
<DialogPortal>
  <DialogOverlay />
  <Primitive.Popup data-slot="dialog-content" {...props} class={classes('cn-dialog-content fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none', classProp)} bind:ref>
    {@render children?.()}
    {#if showCloseButton}
      <Primitive.Close data-slot="dialog-close">
        {#snippet render(closeProps: Record<string | symbol, unknown>, _state: unknown, closeChildren: Snippet | undefined)}
          {const { tabindex, ...buttonProps } = $derived(closeProps)}
          <Button {...(tabindex === undefined ? buttonProps : closeProps)} variant="ghost" class="cn-dialog-close" size="icon-sm">
            {@render closeChildren?.()}
          </Button>
        {/snippet}
        <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" />
        <span class="sr-only">Close</span>
      </Primitive.Close>
    {/if}
  </Primitive.Popup>
</DialogPortal>
