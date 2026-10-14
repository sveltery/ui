<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { TooltipTriggerState } from '@sveltery/base/tooltip';
  import { cn } from 'cn';
  import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/index.js';
  import { useSidebar } from './context.js';
  import { sidebarMenuButtonVariants } from './variants.js';
  import type { SidebarMenuButtonProps, SidebarMenuButtonState } from './types.js';
  let { children, class: classProp, render, isActive = false, variant = 'default', size = 'default', tooltip, ...props }: SidebarMenuButtonProps = $props();
  const sidebar = useSidebar();
  const state: SidebarMenuButtonState = $derived({ slot: 'sidebar-menu-button', sidebar: 'menu-button', size, active: isActive });
  const hostProps: HTMLButtonAttributes = $derived({
    'data-slot': state.slot,
    'data-sidebar': state.sidebar,
    'data-size': state.size,
    'data-active': isActive || undefined,
    ...props,
    class: cn(sidebarMenuButtonVariants({ variant, size }), classProp),
  });
  const tooltipHidden = $derived(sidebar.state !== 'collapsed' || sidebar.isMobile);
</script>
{#snippet host(props: HTMLButtonAttributes, hostState: SidebarMenuButtonState | TooltipTriggerState, content?: Snippet)}
  {#if render}
    {@render render(props, hostState, content)}
  {:else}
    <button {...props}>{@render content?.()}</button>
  {/if}
{/snippet}
{#if tooltip}
  <Tooltip>
    <TooltipTrigger {...hostProps} render={host} {children} />
    {#if typeof tooltip === 'string'}
      <TooltipContent side="right" align="center" hidden={tooltipHidden}>{tooltip}</TooltipContent>
    {:else}
      <TooltipContent side="right" align="center" hidden={tooltipHidden} {...tooltip} />
    {/if}
  </Tooltip>
{:else}
  {@render host(hostProps, state, children)}
{/if}
