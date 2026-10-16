<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@sveltery/components/collapsible';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
  } from '@sveltery/components/sidebar';

  const navMain = [
    { title: 'Dashboard', isActive: true, items: ['Overview', 'Analytics'] },
    { title: 'Analytics', items: ['Reports', 'Metrics'] },
    { title: 'Orders', items: ['All Orders', 'Pending', 'Completed'] },
    { title: 'Products', items: ['All Products', 'Categories'] },
    { title: 'Invoices' },
    { title: 'Customers' },
    { title: 'Settings' },
  ];
  const navSecondary = ['Support', 'Feedback'];
</script>

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

{#snippet action(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <SidebarMenuAction {...props}>{@render children?.()}</SidebarMenuAction>
{/snippet}

{#snippet navIcon(title: string)}
  {#if title === 'Dashboard'}
    <IconPlaceholder lucide="HomeIcon" tabler="IconHome" hugeicons="Home01Icon" phosphor="HouseIcon" remixicon="RiHomeLine" />
  {:else if title === 'Analytics'}
    <IconPlaceholder lucide="ChartLineIcon" tabler="IconChartLine" hugeicons="ChartIcon" phosphor="ChartLineIcon" remixicon="RiLineChartLine" />
  {:else if title === 'Orders'}
    <IconPlaceholder lucide="ShoppingBagIcon" tabler="IconShoppingBag" hugeicons="ShoppingBag01Icon" phosphor="BagIcon" remixicon="RiShoppingBagLine" />
  {:else if title === 'Products'}
    <IconPlaceholder lucide="ShoppingCartIcon" tabler="IconShoppingCart" hugeicons="ShoppingCart01Icon" phosphor="ShoppingCartIcon" remixicon="RiShoppingCartLine" />
  {:else if title === 'Invoices'}
    <IconPlaceholder lucide="FileIcon" tabler="IconFile" hugeicons="File01Icon" phosphor="FileIcon" remixicon="RiFileLine" />
  {:else if title === 'Customers'}
    <IconPlaceholder lucide="UserIcon" tabler="IconUser" hugeicons="UserIcon" phosphor="UserIcon" remixicon="RiUserLine" />
  {:else if title === 'Settings'}
    <IconPlaceholder lucide="Settings2Icon" tabler="IconSettings" hugeicons="Settings05Icon" phosphor="GearIcon" remixicon="RiSettingsLine" />
  {:else if title === 'Support'}
    <IconPlaceholder lucide="LifeBuoy" tabler="IconLifebuoy" hugeicons="ChartRingIcon" phosphor="LifebuoyIcon" remixicon="RiLifebuoyLine" />
  {:else}
    <IconPlaceholder lucide="Send" tabler="IconSend" hugeicons="SentIcon" phosphor="PaperPlaneTiltIcon" remixicon="RiSendPlaneLine" />
  {/if}
{/snippet}

<!-- The transform makes this box the containing block of the sidebar's fixed container, so it fills the box and not the window. -->
<div class="relative h-[32rem] w-full transform-gpu overflow-hidden rounded-lg border">
  <SidebarProvider class="h-full min-h-0">
    <Sidebar variant="inset" class="absolute h-full">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            {#each navMain as item (item.title)}
              <SidebarMenuItem>
                <Collapsible open={item.isActive}>
                  <SidebarMenuButton render={link} isActive={item.isActive}>
                    {@render navIcon(item.title)}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {#if item.items}
                    <CollapsibleTrigger render={action} class="data-panel-open:rotate-90">
                      <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" />
                      <span class="sr-only">Toggle</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {#each item.items as subItem (subItem)}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="#">{subItem}</SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        {/each}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  {/if}
                </Collapsible>
              </SidebarMenuItem>
            {/each}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup class="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {#each navSecondary as title (title)}
                <SidebarMenuItem>
                  <SidebarMenuButton render={link} size="sm">
                    {@render navIcon(title)}
                    <span>{title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              {/each}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    <SidebarInset class="min-w-0 overflow-auto">
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="aspect-video rounded-xl bg-muted/50"></div>
          <div class="aspect-video rounded-xl bg-muted/50"></div>
          <div class="aspect-video rounded-xl bg-muted/50"></div>
        </div>
        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</div>
