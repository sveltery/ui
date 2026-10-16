<script lang="ts">
  import type { MarkerProps, MarkerState } from './types.js';
  import { cn } from 'cn';
  import { markerVariants } from './variants.js';
  let { children, class: classProp, variant = 'default', render, ...props }: MarkerProps = $props();
  const state: MarkerState = $derived({ slot: 'marker', variant });
  const hostProps = $derived({ 'data-slot': 'marker', 'data-variant': variant, ...props, class: cn(markerVariants({ variant, class: classProp })) });
</script>
{#if render}
  {@render render(hostProps, state, children)}
{:else}
  <div {...hostProps}>{@render children?.()}</div>
{/if}
