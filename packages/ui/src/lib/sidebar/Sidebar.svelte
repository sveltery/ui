<script lang="ts">
  import { cn } from 'cn';
  import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../sheet/index.js';
  import { useSidebar } from './context.js';
  import { SIDEBAR_WIDTH_MOBILE } from './constants.js';
  import type { SidebarProps } from './types.js';
  let { side = 'left', variant = 'sidebar', collapsible = 'offcanvas', children, class: classProp, ...props }: SidebarProps = $props();
  const sidebar = useSidebar();
  const floatingOrInset = $derived(variant === 'floating' || variant === 'inset');
</script>
{#if collapsible === 'none'}
  <div data-slot="sidebar" {...props} class={cn('flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground', classProp)}>
    {@render children?.()}
  </div>
{:else if sidebar.isMobile}
  <Sheet open={sidebar.openMobile} onOpenChange={sidebar.setOpenMobile}>
    <SheetContent {...props} data-sidebar="sidebar" data-slot="sidebar" data-mobile="true" {side} class="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden" style="--sidebar-width: {SIDEBAR_WIDTH_MOBILE}">
      <SheetHeader class="sr-only">
        <SheetTitle>Sidebar</SheetTitle>
        <SheetDescription>Displays the mobile sidebar.</SheetDescription>
      </SheetHeader>
      <div class="flex h-full w-full flex-col">{@render children?.()}</div>
    </SheetContent>
  </Sheet>
{:else}
  <div class="group peer hidden text-sidebar-foreground md:block" data-state={sidebar.state} data-collapsible={sidebar.state === 'collapsed' ? collapsible : ''} data-variant={variant} data-side={side} data-slot="sidebar">
    <div
      data-slot="sidebar-gap"
      class={cn(
        'cn-sidebar-gap relative w-(--sidebar-width) bg-transparent group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180',
        floatingOrInset ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]' : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
      )}
    ></div>
    <div
      data-slot="sidebar-container"
      data-side={side}
      {...props}
      class={cn(
        'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex',
        floatingOrInset ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]' : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
        classProp,
      )}
    >
      <div data-sidebar="sidebar" data-slot="sidebar-inner" class="cn-sidebar-inner flex size-full flex-col">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}
