<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@sveltery/ui/sidebar';

  let { teams }: { teams: { name: string; logo: Snippet; plan: string }[] } = $props();
  let activeTeam = $state(teams[0]);
</script>

{#snippet menuButton(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <SidebarMenuButton {...props} class="w-fit px-1.5 aria-expanded:bg-muted aria-expanded:text-foreground">{@render children?.()}</SidebarMenuButton>
{/snippet}

{#if activeTeam}
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger render={menuButton}>
          <div class="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            {@render activeTeam.logo()}
          </div>
          <span class="truncate font-medium">{activeTeam.name}</span>
          <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDown01Icon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" class="opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-64 rounded-lg" align="start" side="bottom" sideOffset={4}>
          <DropdownMenuGroup>
            <DropdownMenuLabel class="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
            {#each teams as team, index (team.name)}
              <DropdownMenuItem onclick={() => (activeTeam = team)} class="gap-2 p-2">
                <div class="flex size-6 items-center justify-center rounded-xs border">
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
              <div class="flex size-6 items-center justify-center rounded-md border bg-background">
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
