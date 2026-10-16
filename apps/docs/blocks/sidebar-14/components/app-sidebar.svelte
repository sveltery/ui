<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    type SidebarProps,
  } from '$registry/bases/base/ui/sidebar';
  let { ...props }: SidebarProps = $props();
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
  };
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

<Sidebar {...props}>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Table of Contents</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {#each data.navMain as item (item.title)}
            {#snippet link(props: RenderProps, _state: unknown, children?: Snippet)}
              <a href={item.url} {...props} class={[props.class, 'font-medium']}>{@render children?.()}</a>
            {/snippet}
            <SidebarMenuItem>
              <SidebarMenuButton render={link}>
                {item.title}
              </SidebarMenuButton>
              {#if item.items?.length}
                <SidebarMenuSub>
                  {#each item.items as subItem (subItem.title)}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton isActive={subItem.isActive} href={subItem.url}>
                        {subItem.title}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  {/each}
                </SidebarMenuSub>
              {/if}
            </SidebarMenuItem>
          {/each}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
  <SidebarRail />
</Sidebar>
