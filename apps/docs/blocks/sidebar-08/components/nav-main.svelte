<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@sveltery/components/collapsible';
  import { IconPlaceholder } from '@sveltery/components/icons';
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
  } from '@sveltery/components/sidebar';

  let {
    items,
  }: {
    items: {
      title: string;
      url: string;
      icon: Snippet;
      isActive?: boolean;
      items?: {
        title: string;
        url: string;
      }[];
    }[];
  } = $props();
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

{#snippet menuItem(props: RenderProps, _state: unknown, children?: Snippet)}
  <SidebarMenuItem {...props}>{@render children?.()}</SidebarMenuItem>
{/snippet}

<SidebarGroup>
  <SidebarGroupLabel>Platform</SidebarGroupLabel>
  <SidebarMenu>
    {#each items as item (item.title)}
      {#snippet link(props: RenderProps, _state: unknown, children?: Snippet)}
        <a href={item.url} {...props}>{@render children?.()}</a>
      {/snippet}
      <Collapsible open={item.isActive} render={menuItem}>
        <SidebarMenuButton tooltip={item.title} render={link}>
          {@render item.icon()}
          <span>{item.title}</span>
        </SidebarMenuButton>
        {#if item.items?.length}
          <CollapsibleTrigger>
            {#snippet render(props, _state, children)}
              <SidebarMenuAction {...props} class={[props.class, 'aria-expanded:rotate-90']}>{@render children?.()}</SidebarMenuAction>
            {/snippet}
            <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" />
            <span class="sr-only">Toggle</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {#each item.items as subItem (subItem.title)}
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href={subItem.url}>
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
