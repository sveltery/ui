<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@sveltery/ui/collapsible';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
  } from '@sveltery/ui/sidebar';

  let { items }: { items: { title: string; url: string; icon: Snippet; isActive?: boolean; items?: { title: string; url: string }[] }[] } = $props();
</script>

{#snippet collapsibleTrigger(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <CollapsibleTrigger {...props}>{@render children?.()}</CollapsibleTrigger>
{/snippet}

<SidebarGroup>
  <SidebarGroupLabel>Platform</SidebarGroupLabel>
  <SidebarMenu>
    {#each items as item (item.title)}
      {#snippet menuItem(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
        <SidebarMenuItem {...props}>{@render children?.()}</SidebarMenuItem>
      {/snippet}
      {#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
        <a href={item.url} {...props}>{@render children?.()}</a>
      {/snippet}
      <Collapsible open={item.isActive} render={menuItem}>
        <SidebarMenuButton tooltip={item.title} render={link}>
          {@render item.icon()}
          <span>{item.title}</span>
        </SidebarMenuButton>
        {#if item.items?.length}
          <SidebarMenuAction render={collapsibleTrigger} class="aria-expanded:rotate-90">
            <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" />
            <span class="sr-only">Toggle</span>
          </SidebarMenuAction>
          <CollapsibleContent>
            <SidebarMenuSub>
              {#each item.items as subItem (subItem.title)}
                {#snippet subLink(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
                  <a href={subItem.url} {...props}>{@render children?.()}</a>
                {/snippet}
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton render={subLink}>
                    <span>{subItem.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              {/each}
            </SidebarMenuSub>
          </CollapsibleContent>
        {/if}
      </Collapsible>
    {/each}
  </SidebarMenu>
</SidebarGroup>
