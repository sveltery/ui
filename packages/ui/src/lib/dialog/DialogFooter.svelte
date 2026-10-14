<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { Dialog as Primitive } from '@sveltery/base/dialog';
  import { cn } from 'cn';
  import { Button } from '../button/index.js';
  let { children, class: classProp, showCloseButton = false, ...props }: HTMLAttributes<HTMLDivElement> & { showCloseButton?: boolean } = $props();
</script>
<div data-slot="dialog-footer" {...props} class={cn('cn-dialog-footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', classProp)}>
  {@render children?.()}
  {#if showCloseButton}
    <Primitive.Close>
      {#snippet render(buttonProps, _state, content)}
        <Button variant="outline" {...buttonProps}>{@render content?.()}</Button>
      {/snippet}
      Close
    </Primitive.Close>
  {/if}
</div>
