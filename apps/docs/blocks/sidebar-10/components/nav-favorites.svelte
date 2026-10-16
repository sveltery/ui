<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '$registry/bases/base/ui/dropdown-menu';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from '$registry/bases/base/ui/sidebar';

  let { favorites }: { favorites: { name: string; url: string; emoji: string }[] } = $props();
  const sidebar = useSidebar();
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

<SidebarGroup class="group-data-[collapsible=icon]:hidden">
  <SidebarGroupLabel>Favorites</SidebarGroupLabel>
  <SidebarMenu>
    {#each favorites as item (item.name)}
      {#snippet link(props: RenderProps, _state: unknown, children?: Snippet)}
        <a href={item.url} title={item.name} {...props}>{@render children?.()}</a>
      {/snippet}
      <SidebarMenuItem>
        <SidebarMenuButton render={link}>
          <span>{item.emoji}</span>
          <span>{item.name}</span>
        </SidebarMenuButton>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {#snippet render(props, _state, children)}
              <SidebarMenuAction {...props} showOnHover class={[props.class, 'aria-expanded:bg-muted']}>{@render children?.()}</SidebarMenuAction>
            {/snippet}
            <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDots" hugeicons="MoreHorizontalCircle01Icon" phosphor="DotsThreeOutlineIcon" remixicon="RiMoreLine" />
            <span class="sr-only">More</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56 rounded-lg" side={sidebar.isMobile ? 'bottom' : 'right'} align={sidebar.isMobile ? 'end' : 'start'}>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder lucide="StarOffIcon" tabler="IconStarOff" hugeicons="StarOffIcon" phosphor="StarIcon" remixicon="RiStarOffLine" class="text-muted-foreground" />
                <span>Remove from Favorites</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder lucide="LinkIcon" tabler="IconLink" hugeicons="LinkIcon" phosphor="LinkIcon" remixicon="RiLinksLine" class="text-muted-foreground" />
                <span>Copy Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder lucide="ArrowUpRightIcon" tabler="IconArrowUpRight" hugeicons="ArrowUpRightIcon" phosphor="ArrowUpRightIcon" remixicon="RiArrowRightUpLine" class="text-muted-foreground" />
                <span>Open in New Tab</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconPlaceholder lucide="Trash2Icon" tabler="IconTrash" hugeicons="Delete02Icon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" class="text-muted-foreground" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    {/each}
    <SidebarMenuItem>
      <SidebarMenuButton class="text-sidebar-foreground/70">
        <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDots" hugeicons="MoreHorizontalCircle01Icon" phosphor="DotsThreeOutlineIcon" remixicon="RiMoreLine" />
        <span>More</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarGroup>
