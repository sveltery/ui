<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarMenuActionProps, SidebarMenuActionState } from './types.js';
  let { children, class: classProp, render, showOnHover = false, ...props }: SidebarMenuActionProps = $props();
  const state: SidebarMenuActionState = { slot: 'sidebar-menu-action' };
  const hostProps = $derived({
    'data-slot': state.slot,
    'data-sidebar': 'menu-action',
    ...props,
    class: cn(
      'cn-sidebar-menu-action flex items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0',
      showOnHover && 'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0',
      classProp,
    ),
  });
</script>
{#if render}
  {@render render(hostProps, state, children)}
{:else}
  <button {...hostProps}>{@render children?.()}</button>
{/if}
