<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { Toast as Primitive } from '@sveltery/base/toast';
  import { cn } from 'cn';
  import { Button } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, render, ...props }: ComponentProps<typeof Primitive.Close> = $props();
</script>
{#snippet button(buttonProps: HTMLButtonAttributes, _state: unknown, content: Snippet | undefined)}
  <Button variant="ghost" size="icon-sm" {...buttonProps}>{@render content?.()}</Button>
{/snippet}
<Primitive.Close data-slot="toast-close" aria-label="Close toast" render={render ?? button} {...props} class={cn("relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground", classProp)}>
  {#if children}
    {@render children()}
  {:else}
    <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" aria-hidden="true" />
  {/if}
</Primitive.Close>
