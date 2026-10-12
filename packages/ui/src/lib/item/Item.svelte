<script lang="ts">
  import type { ItemProps, ItemState } from './types.js';
  import { cn } from 'cn';
  import { itemVariants } from './variants.js';
  let { children, class: classProp, variant = 'default', size = 'default', render, ...props }: ItemProps = $props();
  const state: ItemState = $derived({ slot: 'item', variant: variant ?? 'default', size: size ?? 'default' });
  const hostProps = $derived({ 'data-slot': state.slot, 'data-variant': state.variant, 'data-size': state.size, ...props, class: cn(itemVariants({ variant, size }), classProp) });
</script>
{#if render}
  {@render render(hostProps, state, children)}
{:else}
  <div {...hostProps}>{@render children?.()}</div>
{/if}
