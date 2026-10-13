<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { useMessageScroller } from './scroller.svelte.js';
  import type { MessageScrollerButtonProps } from './types.js';

  let { behavior = 'smooth', direction = 'end', type = 'button', tabindex, onclick, render, children, ...rest }: MessageScrollerButtonProps = $props();
  const scroller = useMessageScroller();
  const active = $derived(scroller.scrollable[direction]);

  const buttonProps: HTMLButtonAttributes = $derived({
    type,
    inert: active ? undefined : true,
    tabindex: active ? tabindex : -1,
    ...rest,
    'data-active': active ? 'true' : 'false',
    onclick: (event) => {
      if (!active) return;
      onclick?.(event);
      if (event.defaultPrevented) return;
      event.currentTarget.blur();
      if (direction === 'start') scroller.scrollToStart({ behavior });
      else scroller.scrollToEnd({ behavior });
    }
  });
</script>

{#if render}
  {@render render(buttonProps, { active, direction })}
{:else}
  <button {...buttonProps}>
    {#if children}{@render children()}{:else}<span>Scroll to {direction}</span>{/if}
  </button>
{/if}
