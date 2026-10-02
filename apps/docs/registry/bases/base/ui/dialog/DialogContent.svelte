<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import * as Primitive from '@sveltery/base/dialog';
  import DialogPortal from './DialogPortal.svelte';
  import DialogOverlay from './DialogOverlay.svelte';
  import { classes, closeBase } from '../shared/classes.js';
  let { children, class: classProp, showCloseButton = true, ref = $bindable(null), ...props }: ComponentProps<typeof Primitive.Popup> & { showCloseButton?: boolean } = $props();
</script>
<DialogPortal>
  <DialogOverlay />
  <Primitive.Popup data-slot="dialog-content" {...props} class={classes('cn-dialog-content fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none', classProp)} bind:ref>
    {@render children?.()}
    {#if showCloseButton}
      <Primitive.Close data-slot="dialog-close" class={`${closeBase} cn-button-variant-ghost cn-button-size-icon-sm cn-dialog-close`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        <span class="sr-only">Close</span>
      </Primitive.Close>
    {/if}
  </Primitive.Popup>
</DialogPortal>
