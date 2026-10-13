<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { Field } from '@sveltery/ui/field';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Item, ItemContent, ItemDescription, ItemTitle } from '@sveltery/ui/item';
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
  } from '@sveltery/ui/sidebar';

  const navMain = [
    { title: 'Getting Started', items: ['Installation', 'Project Structure'] },
    { title: 'Build Your Application', items: ['Routing', 'Data Fetching', 'Rendering', 'Caching', 'Styling', 'Optimizing', 'Configuring', 'Testing', 'Authentication', 'Deploying', 'Upgrading', 'Examples'] },
    { title: 'API Reference', items: ['Components', 'File Conventions', 'Functions', 'next.config.js Options', 'CLI', 'Edge Runtime'] },
    { title: 'Architecture', items: ['Accessibility', 'Fast Refresh', 'Next.js Compiler', 'Supported Browsers', 'Turbopack'] },
  ];
</script>

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

{#snippet navButton(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <SidebarMenuButton {...props} class="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground">{@render children?.()}</SidebarMenuButton>
{/snippet}

<!-- The transform makes this box the containing block of the sidebar's fixed container, so it fills the box and not the window. -->
<div class="relative h-[32rem] w-full transform-gpu overflow-hidden rounded-lg border">
  <SidebarProvider class="h-full min-h-0 bg-background">
    <Sidebar variant="floating" class="absolute h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={link}>
              <Item class="p-0" size="xs">
                <ItemContent>
                  <ItemTitle class="text-sm">Documentation</ItemTitle>
                  <ItemDescription>v1.0.0</ItemDescription>
                </ItemContent>
              </Item>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {#each navMain as item (item.title)}
              <DropdownMenu>
                <SidebarMenuItem>
                  <DropdownMenuTrigger render={navButton}>
                    {item.title}
                    <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDots" hugeicons="MoreHorizontalCircle01Icon" phosphor="DotsThreeOutlineIcon" remixicon="RiMoreLine" class="ml-auto" />
                  </DropdownMenuTrigger>
                  {#if item.items.length}
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuGroup>
                        {#each item.items as subItem (subItem)}
                          <DropdownMenuItem render={link}>{subItem}</DropdownMenuItem>
                        {/each}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  {/if}
                </SidebarMenuItem>
              </DropdownMenu>
            {/each}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <Card size="sm" class="-mx-2">
            <CardHeader>
              <CardTitle class="text-sm">Subscribe to our newsletter</CardTitle>
              <CardDescription>Opt-in to receive updates and news about the sidebar.</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <Field>
                  <SidebarInput type="email" placeholder="Email" />
                  <Button class="w-full bg-sidebar-primary text-sidebar-primary-foreground" size="sm">Subscribe</Button>
                </Field>
              </form>
            </CardContent>
          </Card>
        </SidebarGroup>
      </SidebarFooter>
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
