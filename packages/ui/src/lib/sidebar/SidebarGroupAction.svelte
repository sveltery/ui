<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarGroupActionProps, SidebarGroupActionState } from './types.js';
  let { children, class: classProp, render, ...props }: SidebarGroupActionProps = $props();
  const state: SidebarGroupActionState = { slot: 'sidebar-group-action' };
  const hostProps = $derived({ 'data-slot': state.slot, 'data-sidebar': 'group-action', ...props, class: cn('cn-sidebar-group-action flex aspect-square items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0', classProp) });
</script>
{#if render}
  {@render render(hostProps, state, children)}
{:else}
  <button {...hostProps}>{@render children?.()}</button>
{/if}
