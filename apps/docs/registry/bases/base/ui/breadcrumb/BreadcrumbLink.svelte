<script lang="ts">
  import type { BreadcrumbLinkProps, BreadcrumbLinkState } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, render, ...props }: BreadcrumbLinkProps = $props();
  const state: BreadcrumbLinkState = { slot: 'breadcrumb-link' };
  const hostProps = $derived({ 'data-slot': state.slot, ...props, class: cn('cn-breadcrumb-link', classProp) });
</script>
{#if render}
  {@render render(hostProps, state, children)}
{:else}
  <a {...hostProps}>{@render children?.()}</a>
{/if}
