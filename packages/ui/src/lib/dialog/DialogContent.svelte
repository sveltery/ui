<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Dialog as Primitive } from '@sveltery/base/dialog';
  import { cn } from 'cn';
  import DialogPortal from './DialogPortal.svelte';
  import DialogOverlay from './DialogOverlay.svelte';
  import { buttonVariants } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, showCloseButton = true, ...props }: ComponentProps<typeof Primitive.Popup> & { showCloseButton?: boolean } = $props();
</script>
<DialogPortal>
  <DialogOverlay />
  <Primitive.Popup data-slot="dialog-content" {...props} class={cn('cn-dialog-content fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none', classProp)}>
    {@render children?.()}
    {#if showCloseButton}
      <Primitive.Close data-slot="dialog-close" class={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'cn-dialog-close')}>
        <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" />
        <span class="sr-only">Close</span>
      </Primitive.Close>
    {/if}
  </Primitive.Popup>
</DialogPortal>
