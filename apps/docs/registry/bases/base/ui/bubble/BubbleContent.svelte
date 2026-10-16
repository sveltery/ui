<script lang="ts">
  import type { BubbleContentProps, BubbleContentState } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, render, ...props }: BubbleContentProps = $props();
  const state: BubbleContentState = { slot: 'bubble-content' };
  const hostProps = $derived({
    'data-slot': state.slot,
    ...props,
    class: cn('cn-bubble-content w-fit max-w-full min-w-0 overflow-hidden wrap-break-word [button]:text-left [button,a]:transition-colors', classProp),
  });
</script>
{#if render}
  {@render render(hostProps, state, children)}
{:else}
  <div {...hostProps}>{@render children?.()}</div>
{/if}
