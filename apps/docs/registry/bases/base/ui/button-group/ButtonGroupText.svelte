<script lang="ts">
  import type { ButtonGroupTextProps, ButtonGroupTextState } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, render, ...props }: ButtonGroupTextProps = $props();
  const state: ButtonGroupTextState = { slot: 'button-group-text' };
  const hostProps = $derived({ 'data-slot': state.slot, ...props, class: cn('cn-button-group-text flex items-center [&_svg]:pointer-events-none', classProp) });
</script>
{#if render}
  {@render render(hostProps, state, children)}
{:else}
  <div {...hostProps}>{@render children?.()}</div>
{/if}
