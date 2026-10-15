<script lang="ts">
  import type { BadgeProps, BadgeState } from './types.js';
  import { cn } from 'cn';
  import { badgeVariants } from './variants.js';
  let { children, class: classProp, variant = 'default', render, ...props }: BadgeProps = $props();
  const state: BadgeState = $derived({ slot: 'badge', variant });
  const hostProps = $derived({ 'data-slot': 'badge', 'data-variant': state.variant, ...props, class: cn(badgeVariants({ variant }), classProp) });
</script>
{#if render}
  {@render render(hostProps, state, children)}
{:else}
  <span {...hostProps}>{@render children?.()}</span>
{/if}
