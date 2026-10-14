<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@sveltery/ui/collapsible';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@sveltery/ui/sidebar';
  import SearchForm from './search-form.svelte';
  import VersionSwitcher from './version-switcher.svelte';

  let { ...props }: ComponentProps<typeof Sidebar> = $props();

  // This is sample data.
  const data = {
    versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
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

{#snippet trigger(props: RenderProps, _state: unknown, children?: Snippet)}
  <CollapsibleTrigger {...props}>{@render children?.()}</CollapsibleTrigger>
{/snippet}

<Sidebar {...props}>
  <SidebarHeader>
    <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
    <SearchForm />
  </SidebarHeader>
  <SidebarContent class="gap-0">
    <!-- We create a collapsible SidebarGroup for each parent. -->
    {#each data.navMain as group (group.title)}
      <Collapsible title={group.title} open class="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel class="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" render={trigger}>
            {group.title}
            <IconPlaceholder
              lucide="ChevronRightIcon"
              tabler="IconChevronRight"
              hugeicons="ArrowRight01Icon"
              phosphor="CaretRightIcon"
              remixicon="RiArrowRightSLine"
              class="ml-auto transition-transform group-data-open/collapsible:rotate-90"
            />
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {#each group.items as item (item.title)}
                  {#snippet link(props: RenderProps, _state: unknown, children?: Snippet)}
                    <a href={item.url} {...props}>{@render children?.()}</a>
                  {/snippet}
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={item.isActive} render={link}>
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                {/each}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    {/each}
  </SidebarContent>
  <SidebarRail />
</Sidebar>
