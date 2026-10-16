<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$registry/bases/base/ui/collapsible';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
  } from '$registry/bases/base/ui/sidebar';

  let { workspaces }: { workspaces: { name: string; emoji: string; pages: { name: string; emoji: string }[] }[] } = $props();
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

{#snippet link(props: RenderProps, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

{#snippet collapsibleTrigger(props: RenderProps, _state: unknown, children?: Snippet)}
  <CollapsibleTrigger {...props}>{@render children?.()}</CollapsibleTrigger>
{/snippet}

<SidebarGroup>
  <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
  <SidebarGroupContent>
    <SidebarMenu>
      {#each workspaces as workspace (workspace.name)}
        <Collapsible>
          <SidebarMenuItem>
            <SidebarMenuButton render={link}>
              <span>{workspace.emoji}</span>
              <span>{workspace.name}</span>
            </SidebarMenuButton>
            <SidebarMenuAction render={collapsibleTrigger} class="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-panel-open:rotate-90" showOnHover>
              <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" />
            </SidebarMenuAction>
            <SidebarMenuAction showOnHover>
              <IconPlaceholder lucide="PlusIcon" tabler="IconPlus" hugeicons="PlusSignIcon" phosphor="PlusIcon" remixicon="RiAddLine" />
            </SidebarMenuAction>
            <CollapsibleContent>
              <SidebarMenuSub>
                {#each workspace.pages as page (page.name)}
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton render={link}>
                      <span>{page.emoji}</span>
                      <span>{page.name}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                {/each}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      {/each}
      <SidebarMenuItem>
        <SidebarMenuButton class="text-sidebar-foreground/70">
          <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDots" hugeicons="MoreHorizontalCircle01Icon" phosphor="DotsThreeOutlineIcon" remixicon="RiMoreLine" />
          <span>More</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroupContent>
</SidebarGroup>
