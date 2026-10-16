<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$registry/bases/base/ui/collapsible';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
  } from '$registry/bases/base/ui/sidebar';
  import SearchForm from './search-form.svelte';

  let { ...props }: ComponentProps<typeof Sidebar> = $props();

  // This is sample data.
  const data = {
    navMain: [
      {
        title: 'Getting Started',
        url: '#',
        items: [
          {
            title: 'Installation',
            url: '#',
          },
          {
            title: 'Project Structure',
            url: '#',
          },
        ],
      },
      {
        title: 'Build Your Application',
        url: '#',
        items: [
          {
            title: 'Routing',
            url: '#',
          },
          {
            title: 'Data Fetching',
            url: '#',
            isActive: true,
          },
          {
            title: 'Rendering',
            url: '#',
          },
          {
            title: 'Caching',
            url: '#',
          },
          {
            title: 'Styling',
            url: '#',
          },
          {
            title: 'Optimizing',
            url: '#',
          },
          {
            title: 'Configuring',
            url: '#',
          },
          {
            title: 'Testing',
            url: '#',
          },
          {
            title: 'Authentication',
            url: '#',
          },
          {
            title: 'Deploying',
            url: '#',
          },
          {
            title: 'Upgrading',
            url: '#',
          },
          {
            title: 'Examples',
            url: '#',
          },
        ],
      },
      {
        title: 'API Reference',
        url: '#',
        items: [
          {
            title: 'Components',
            url: '#',
          },
          {
            title: 'File Conventions',
            url: '#',
          },
          {
            title: 'Functions',
            url: '#',
          },
          {
            title: 'next.config.js Options',
            url: '#',
          },
          {
            title: 'CLI',
            url: '#',
          },
          {
            title: 'Edge Runtime',
            url: '#',
          },
        ],
      },
      {
        title: 'Architecture',
        url: '#',
        items: [
          {
            title: 'Accessibility',
            url: '#',
          },
          {
            title: 'Fast Refresh',
            url: '#',
          },
          {
            title: 'Next.js Compiler',
            url: '#',
          },
          {
            title: 'Supported Browsers',
            url: '#',
          },
          {
            title: 'Turbopack',
            url: '#',
          },
        ],
      },
      {
        title: 'Community',
        url: '#',
        items: [
          {
            title: 'Contribution Guide',
            url: '#',
          },
        ],
      },
    ],
  }
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

{#snippet home(props: RenderProps, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

{#snippet trigger(props: RenderProps, _state: unknown, children?: Snippet)}
  <CollapsibleTrigger {...props}>{@render children?.()}</CollapsibleTrigger>
{/snippet}

<Sidebar {...props}>
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" render={home}>
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <IconPlaceholder lucide="GalleryVerticalEndIcon" tabler="IconLayoutRows" hugeicons="LayoutBottomIcon" phosphor="RowsIcon" remixicon="RiGalleryLine" class="size-4" />
          </div>
          <div class="flex flex-col gap-0.5 leading-none">
            <span class="font-medium">Documentation</span>
            <span class="">v1.0.0</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
    <SearchForm />
  </SidebarHeader>
  <SidebarContent>
    <SidebarGroup>
      <SidebarMenu>
        {#each data.navMain as item, index (item.title)}
          <Collapsible open={index === 1} class="group/collapsible">
            <SidebarMenuItem>
              <SidebarMenuButton render={trigger}>
                {item.title}
                <IconPlaceholder lucide="PlusIcon" tabler="IconPlus" hugeicons="PlusSignIcon" phosphor="PlusIcon" remixicon="RiAddLine" class="ml-auto group-aria-expanded/menu-button:hidden" />
                <IconPlaceholder lucide="MinusIcon" tabler="IconMinus" hugeicons="MinusSignIcon" phosphor="MinusIcon" remixicon="RiSubtractLine" class="ml-auto hidden group-aria-expanded/menu-button:block" />
              </SidebarMenuButton>
              {#if item.items?.length}
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {#each item.items as subItem (subItem.title)}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive={subItem.isActive} href={subItem.url}>
                          {subItem.title}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    {/each}
                  </SidebarMenuSub>
                </CollapsibleContent>
              {/if}
            </SidebarMenuItem>
          </Collapsible>
        {/each}
      </SidebarMenu>
    </SidebarGroup>
  </SidebarContent>
  <SidebarRail />
</Sidebar>
