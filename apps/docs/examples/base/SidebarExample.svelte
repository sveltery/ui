<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@sveltery/components/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@sveltery/components/item';
  import { Label } from '@sveltery/components/label';
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
  } from '@sveltery/components/sidebar';

  const versions = ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'];
  let selectedVersion = $state(versions[0]);
  const navMain: { title: string; items: { title: string; isActive?: boolean }[] }[] = [
    {
      title: 'Getting Started',
      items: [{ title: 'Installation' }, { title: 'Project Structure' }],
    },
    {
      title: 'Build Your Application',
      items: [{ title: 'Routing' }, { title: 'Data Fetching', isActive: true }, { title: 'Rendering' }, { title: 'Caching' }, { title: 'Styling' }, { title: 'Optimizing' }, { title: 'Configuring' }, { title: 'Testing' }, { title: 'Authentication' }, { title: 'Deploying' }, { title: 'Upgrading' }, { title: 'Examples' }],
    },
    {
      title: 'API Reference',
      items: [{ title: 'Components' }, { title: 'File Conventions' }, { title: 'Functions' }, { title: 'next.config.js Options' }, { title: 'CLI' }, { title: 'Edge Runtime' }],
    },
    {
      title: 'Architecture',
      items: [{ title: 'Accessibility' }, { title: 'Fast Refresh' }, { title: 'Next.js Compiler' }, { title: 'Supported Browsers' }, { title: 'Turbopack' }],
    },
  ];
</script>

{#snippet menuButton(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <SidebarMenuButton {...props} size="lg" class="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground">{@render children?.()}</SidebarMenuButton>
{/snippet}

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

<!-- The transform makes this box the containing block of the sidebar's fixed container, so it fills the box and not the window. -->
<div class="relative h-[32rem] w-full transform-gpu overflow-hidden rounded-lg border">
  <SidebarProvider class="h-full min-h-0">
    <Sidebar class="absolute h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={menuButton}>
                <Item class="p-0" size="xs">
                  <ItemContent>
                    <ItemTitle class="text-sm">Documentation</ItemTitle>
                    <ItemDescription>v{selectedVersion}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <IconPlaceholder lucide="ChevronsUpDownIcon" tabler="IconSelector" hugeicons="UnfoldMoreIcon" phosphor="CaretUpDownIcon" remixicon="RiArrowUpDownLine" />
                  </ItemActions>
                </Item>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {#each versions as version (version)}
                  <DropdownMenuItem onclick={() => (selectedVersion = version)}>
                    v{version}
                    {#if version === selectedVersion}
                      <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" class="ml-auto" />
                    {/if}
                  </DropdownMenuItem>
                {/each}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <form>
          <SidebarGroup class="py-0">
            <SidebarGroupContent class="relative">
              <Label for="search" class="sr-only">Search</Label>
              <SidebarInput id="search" placeholder="Search the docs..." class="pl-8" />
              <IconPlaceholder
                lucide="SearchIcon"
                tabler="IconSearch"
                hugeicons="SearchIcon"
                phosphor="MagnifyingGlassIcon"
                remixicon="RiSearchLine"
                class="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"
              />
            </SidebarGroupContent>
          </SidebarGroup>
        </form>
      </SidebarHeader>
      <SidebarContent>
        {#each navMain as group (group.title)}
          <SidebarGroup>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {#each group.items as item (item.title)}
                  <SidebarMenuItem>
                    <SidebarMenuButton render={link} isActive={item.isActive}>{item.title}</SidebarMenuButton>
                  </SidebarMenuItem>
                {/each}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        {/each}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    <SidebarInset class="min-w-0 overflow-auto">
      <header class="flex h-16 shrink-0 items-center gap-2 px-4">
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
