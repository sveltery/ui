<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@sveltery/ui/sidebar';

  let {
    items,
  }: {
    items: {
      title: string;
      url: string;
      icon?: Snippet;
      isActive?: boolean;
      items?: {
        title: string;
        url: string;
      }[];
    }[];
  } = $props();

  const sidebar = useSidebar();
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

{#snippet menuButton(props: RenderProps, _state: unknown, children?: Snippet)}
  <SidebarMenuButton {...props} class={[props.class, 'aria-expanded:bg-muted']}>{@render children?.()}</SidebarMenuButton>
{/snippet}

<SidebarGroup>
  <SidebarMenu>
    {#each items as item (item.title)}
      <DropdownMenu>
        <SidebarMenuItem>
          <DropdownMenuTrigger render={menuButton}>
            {item.title}
            <IconPlaceholder
              lucide="MoreHorizontalIcon"
              tabler="IconDots"
              hugeicons="MoreHorizontalCircle01Icon"
              phosphor="DotsThreeOutlineIcon"
              remixicon="RiMoreLine"
              class="ml-auto"
            />
          </DropdownMenuTrigger>
          {#if item.items?.length}
            <DropdownMenuContent side={sidebar.isMobile ? 'bottom' : 'right'} align={sidebar.isMobile ? 'end' : 'start'} class="min-w-56 rounded-lg">
              {#each item.items as subItem (subItem.title)}
                {#snippet link(props: RenderProps, _state: unknown, children?: Snippet)}
                  <a href={subItem.url} {...props}>{@render children?.()}</a>
                {/snippet}
                <DropdownMenuItem render={link}>
                  {subItem.title}
                </DropdownMenuItem>
              {/each}
            </DropdownMenuContent>
          {/if}
        </SidebarMenuItem>
      </DropdownMenu>
    {/each}
  </SidebarMenu>
</SidebarGroup>
