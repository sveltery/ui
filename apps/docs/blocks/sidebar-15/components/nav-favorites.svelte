<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@sveltery/ui/sidebar';

  let { favorites }: { favorites: { name: string; url: string; emoji: string }[] } = $props();
  const sidebar = useSidebar();
</script>

{#snippet menuAction(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <SidebarMenuAction {...props} showOnHover class="aria-expanded:bg-muted">{@render children?.()}</SidebarMenuAction>
{/snippet}

<SidebarGroup class="group-data-[collapsible=icon]:hidden">
  <SidebarGroupLabel>Favorites</SidebarGroupLabel>
  <SidebarMenu>
    {#each favorites as item (item.name)}
      {#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
        <a href={item.url} title={item.name} {...props}>{@render children?.()}</a>
      {/snippet}
      <SidebarMenuItem>
        <SidebarMenuButton render={link}>
          <span>{item.emoji}</span>
          <span>{item.name}</span>
        </SidebarMenuButton>
        <DropdownMenu>
          <DropdownMenuTrigger render={menuAction}>
            <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDots" hugeicons="MoreHorizontalCircle01Icon" phosphor="DotsThreeOutlineIcon" remixicon="RiMoreLine" />
            <span class="sr-only">More</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56 rounded-lg" side={sidebar.isMobile ? 'bottom' : 'right'} align={sidebar.isMobile ? 'end' : 'start'}>
            <DropdownMenuItem>
              <IconPlaceholder lucide="StarOffIcon" tabler="IconStarOff" hugeicons="StarOffIcon" phosphor="StarIcon" remixicon="RiStarOffLine" class="text-muted-foreground" />
              <span>Remove from Favorites</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
