<script lang="ts">
  import { cn } from 'cn';
  import { Skeleton } from '../skeleton/index.js';
  import type { SidebarMenuSkeletonProps } from './types.js';
  let { class: classProp, showIcon = false, ...props }: SidebarMenuSkeletonProps = $props();
  const width = `${Math.floor(Math.random() * 40) + 50}%`;
</script>
<div data-slot="sidebar-menu-skeleton" data-sidebar="menu-skeleton" {...props} class={cn('cn-sidebar-menu-skeleton flex items-center', classProp)}>
  {#if showIcon}
    <Skeleton class="cn-sidebar-menu-skeleton-icon" data-sidebar="menu-skeleton-icon" />
  {/if}
  <Skeleton class="cn-sidebar-menu-skeleton-text max-w-(--skeleton-width) flex-1" data-sidebar="menu-skeleton-text" style="--skeleton-width: {width}" />
</div>
