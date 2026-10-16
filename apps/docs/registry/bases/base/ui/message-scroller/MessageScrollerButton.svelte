<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { Button } from '@sveltery/svelte/message-scroller';
  import { cn } from 'cn';
  import { Button as UIButton } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  import type { MessageScrollerButtonProps } from './types.js';
  let { direction = 'end', variant = 'secondary', size = 'icon-sm', class: classProp, children, render, ...props }: MessageScrollerButtonProps = $props();
</script>
{#snippet button(buttonProps: HTMLButtonAttributes)}
  <UIButton {variant} {size} {...buttonProps}>
    {#if children}
      {@render children()}
    {:else}
      <IconPlaceholder lucide="ArrowDownIcon" tabler="IconArrowDown" hugeicons="ArrowDown02Icon" phosphor="ArrowDownIcon" remixicon="RiArrowDownLine" />
      <span class="sr-only">{direction === 'end' ? 'Scroll to end' : 'Scroll to start'}</span>
    {/if}
  </UIButton>
{/snippet}
<Button
  data-slot="message-scroller-button"
  data-direction={direction}
  data-variant={variant}
  data-size={size}
  {direction}
  render={render ?? button}
  {...props}
  class={cn('cn-message-scroller-button absolute inset-s-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180', classProp)}
/>
