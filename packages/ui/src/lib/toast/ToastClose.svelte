<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Toast as Primitive } from '@sveltery/base/toast';
  import { cn } from 'cn';
  import { buttonVariants } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Close> = $props();
</script>
<Primitive.Close data-slot="toast-close" aria-label="Close toast" {...props} class={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground", classProp)}>
  {#if children}
    {@render children()}
  {:else}
    <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" aria-hidden="true" />
  {/if}
</Primitive.Close>
