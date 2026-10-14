<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@sveltery/ui/collapsible';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@sveltery/ui/sidebar';

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
      {#snippet trigger(props: RenderProps, _state: unknown, children?: Snippet)}
        <SidebarMenuButton {...props} tooltip={item.title}>{@render children?.()}</SidebarMenuButton>
      {/snippet}
      <Collapsible open={item.isActive} class="group/collapsible" render={menuItem}>
        <CollapsibleTrigger render={trigger}>
          {@render item.icon?.()}
          <span>{item.title}</span>
          <IconPlaceholder
            lucide="ChevronRightIcon"
            tabler="IconChevronRight"
            hugeicons="ArrowRight01Icon"
            phosphor="CaretRightIcon"
            remixicon="RiArrowRightSLine"
            class="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90"
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {#each item.items ?? [] as subItem (subItem.title)}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton href={subItem.url}>
                  <span>{subItem.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            {/each}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    {/each}
  </SidebarMenu>
</SidebarGroup>
