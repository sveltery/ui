<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from '@sveltery/components/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@sveltery/components/sidebar';

  let {
    teams,
  }: {
    teams: {
      name: string;
      logo: Snippet;
      plan: string;
    }[];
  } = $props();

  const sidebar = useSidebar();
  // svelte-ignore state_referenced_locally
  let activeTeam = $state.raw(teams[0]);
</script>

{#if activeTeam}
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {#snippet render(props, _state, children)}
            <SidebarMenuButton {...props} size="lg" class={[props.class, 'data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground']}>{@render children?.()}</SidebarMenuButton>
          {/snippet}
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {@render activeTeam.logo()}
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-medium">{activeTeam.name}</span>
            <span class="truncate text-xs">{activeTeam.plan}</span>
          </div>
          <IconPlaceholder lucide="ChevronsUpDownIcon" tabler="IconSelector" hugeicons="UnfoldMoreIcon" phosphor="CaretUpDownIcon" remixicon="RiArrowUpDownLine" class="ml-auto" />
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-fit" align="start" side={sidebar.isMobile ? 'bottom' : 'right'} sideOffset={4}>
          <DropdownMenuGroup>
            <DropdownMenuLabel class="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
            {#each teams as team, index (team.name)}
              <DropdownMenuItem onclick={() => (activeTeam = team)} class="gap-2 p-2">
                <div class="flex size-6 items-center justify-center rounded-md border">
                  {@render team.logo()}
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            {/each}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem class="gap-2 p-2">
              <div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <IconPlaceholder lucide="PlusIcon" tabler="IconPlus" hugeicons="PlusSignIcon" phosphor="PlusIcon" remixicon="RiAddLine" class="size-4" />
              </div>
              <div class="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
{/if}
