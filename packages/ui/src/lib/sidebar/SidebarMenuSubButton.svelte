<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarMenuSubButtonProps, SidebarMenuSubButtonState } from './types.js';
  let { children, class: classProp, render, size = 'md', isActive = false, ...props }: SidebarMenuSubButtonProps = $props();
  const state: SidebarMenuSubButtonState = $derived({ slot: 'sidebar-menu-sub-button', sidebar: 'menu-sub-button', size, active: isActive });
  const hostProps = $derived({
    'data-slot': state.slot,
    'data-sidebar': state.sidebar,
    'data-size': size,
    'data-active': isActive || undefined,
    ...props,
    class: cn(
      'cn-sidebar-menu-sub-button flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0',
      classProp,
    ),
  });
</script>
{#if render}
  {@render render(hostProps, state, children)}
{:else}
  <a {...hostProps}>{@render children?.()}</a>
{/if}
