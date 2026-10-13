<script lang="ts">
  import { cn } from 'cn';
  import type { SidebarGroupLabelProps, SidebarGroupLabelState } from './types.js';
  let { children, class: classProp, render, ...props }: SidebarGroupLabelProps = $props();
  const state: SidebarGroupLabelState = { slot: 'sidebar-group-label' };
  const hostProps = $derived({ 'data-slot': state.slot, 'data-sidebar': 'group-label', ...props, class: cn('cn-sidebar-group-label flex shrink-0 items-center outline-hidden [&>svg]:shrink-0', classProp) });
</script>
{#if render}
  {@render render(hostProps, state, children)}
{:else}
  <div {...hostProps}>{@render children?.()}</div>
{/if}
