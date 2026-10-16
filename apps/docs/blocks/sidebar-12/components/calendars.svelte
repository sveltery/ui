<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@sveltery/components/collapsible';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@sveltery/components/sidebar';

  let { calendars }: { calendars: { name: string; items: string[] }[] } = $props();
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

{#snippet collapsibleTrigger(props: RenderProps, _state: unknown, children?: Snippet)}
  <CollapsibleTrigger {...props}>{@render children?.()}</CollapsibleTrigger>
{/snippet}

{#each calendars as calendar, index (calendar.name)}
  <SidebarGroup>
    <Collapsible open={index === 0} class="group/collapsible">
      <SidebarGroupLabel class="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" render={collapsibleTrigger}>
        {calendar.name}
        <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" class="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
      </SidebarGroupLabel>
      <CollapsibleContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {#each calendar.items as item, itemIndex (item)}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <div
                    data-active={itemIndex < 2}
                    class="group/calendar-item flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary"
                  >
                    <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" class="hidden size-3 group-data-[active=true]/calendar-item:block" />
                  </div>
                  {item}
                </SidebarMenuButton>
              </SidebarMenuItem>
            {/each}
          </SidebarMenu>
        </SidebarGroupContent>
      </CollapsibleContent>
    </Collapsible>
  </SidebarGroup>
  <SidebarSeparator class="mx-0" />
{/each}
