<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@sveltery/ui/sidebar';

  let { projects }: { projects: { name: string; url: string; icon: Snippet }[] } = $props();
  const sidebar = useSidebar();
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

<SidebarGroup class="group-data-[collapsible=icon]:hidden">
  <SidebarGroupLabel>Projects</SidebarGroupLabel>
  <SidebarMenu>
    {#each projects as item (item.name)}
      {#snippet link(props: RenderProps, _state: unknown, children?: Snippet)}
        <a href={item.url} {...props}>{@render children?.()}</a>
      {/snippet}
      <SidebarMenuItem>
        <SidebarMenuButton render={link}>
          {@render item.icon()}
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
          <DropdownMenuContent class="w-48" side={sidebar.isMobile ? 'bottom' : 'right'} align={sidebar.isMobile ? 'end' : 'start'}>
            <DropdownMenuItem>
              <IconPlaceholder lucide="FolderIcon" tabler="IconFolder" hugeicons="FolderIcon" phosphor="FolderIcon" remixicon="RiFolderLine" class="text-muted-foreground" />
              <span>View Project</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder lucide="ShareIcon" tabler="IconShare2" hugeicons="Share03Icon" phosphor="ShareIcon" remixicon="RiShareLine" class="text-muted-foreground" />
              <span>Share Project</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconPlaceholder lucide="Trash2Icon" tabler="IconTrash" hugeicons="Delete02Icon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" class="text-muted-foreground" />
              <span>Delete Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    {/each}
    <SidebarMenuItem>
      <SidebarMenuButton>
        <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDots" hugeicons="MoreHorizontalCircle01Icon" phosphor="DotsThreeOutlineIcon" remixicon="RiMoreLine" />
        <span>More</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarGroup>
