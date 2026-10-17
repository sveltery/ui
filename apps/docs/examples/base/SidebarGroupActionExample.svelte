<script lang="ts">
  import FrameIcon from '@lucide/svelte/icons/frame';
  import MapIcon from '@lucide/svelte/icons/map';
  import PieChartIcon from '@lucide/svelte/icons/pie-chart';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider
  } from '$registry/bases/base/ui/sidebar';
  import { toast } from '$registry/bases/base/ui/toast';
</script>

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

<!-- The transform makes this box the containing block of the sidebar's fixed container, so it fills the box and not the window. -->
<div class="relative h-[32rem] w-full transform-gpu overflow-hidden rounded-lg border">
  <SidebarProvider class="h-full min-h-0">
    <Sidebar class="absolute h-full">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction title="Add Project" onclick={() => toast.add({ title: 'You clicked the group action!' })}>
            <PlusIcon /> <span class="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={link}>
                  <FrameIcon />
                  <span>Design Engineering</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={link}>
                  <PieChartIcon />
                  <span>Sales & Marketing</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={link}>
                  <MapIcon />
                  <span>Travel</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
</div>
