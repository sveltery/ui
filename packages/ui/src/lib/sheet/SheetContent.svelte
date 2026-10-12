<script lang="ts">
  import { Dialog as Primitive } from '@sveltery/base/dialog';
  import { cn } from 'cn';
  import SheetPortal from './SheetPortal.svelte';
  import SheetOverlay from './SheetOverlay.svelte';
  import type { SheetContentProps } from './types.js';
  import { buttonVariants } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, side = 'right', showCloseButton = true, ...props }: SheetContentProps = $props();
</script>
<SheetPortal>
  <SheetOverlay />
  <Primitive.Popup
    data-slot="sheet-content"
    data-side={side}
    {...props}
    class={cn(
      'cn-sheet-content data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem]',
      classProp,
    )}
  >
    {@render children?.()}
    {#if showCloseButton}
      <Primitive.Close data-slot="sheet-close" class={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'cn-sheet-close')}>
        <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" />
        <span class="sr-only">Close</span>
      </Primitive.Close>
    {/if}
  </Primitive.Popup>
</SheetPortal>
