<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Dialog as Primitive } from '@sveltery/base/dialog';
  import { cn } from 'cn';
  import SheetPortal from './SheetPortal.svelte';
  import SheetOverlay from './SheetOverlay.svelte';
  import { Button } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, side = 'right', showCloseButton = true, ...props }: ComponentProps<typeof Primitive.Popup> & { side?: 'top' | 'right' | 'bottom' | 'left'; showCloseButton?: boolean } = $props();
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
      <Primitive.Close data-slot="sheet-close">
        {#snippet render(buttonProps, _state, content)}
          <Button variant="ghost" class="cn-sheet-close" size="icon-sm" {...buttonProps}>{@render content?.()}</Button>
        {/snippet}
        <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" />
        <span class="sr-only">Close</span>
      </Primitive.Close>
    {/if}
  </Primitive.Popup>
</SheetPortal>
