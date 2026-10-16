<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Avatar, AvatarFallback, AvatarImage } from '@sveltery/components/avatar';
  import { Button } from '@sveltery/components/button';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@sveltery/components/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@sveltery/components/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@sveltery/components/item';
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
  } from '@sveltery/components/sidebar';

  const user = { name: 'shadcn', email: 'm@example.com', avatar: 'https://github.com/shadcn.png' };
  const teams = [
    { name: 'Acme Inc', plan: 'Enterprise' },
    { name: 'Acme Corp.', plan: 'Startup' },
    { name: 'Evil Corp.', plan: 'Free' },
  ];
  let activeTeam = $state(teams[0]);
  const navMain = [
    { title: 'Playground', isActive: true, items: ['History', 'Starred', 'Settings'] },
    { title: 'Models', items: ['Genesis', 'Explorer', 'Quantum'] },
    { title: 'Documentation', items: ['Introduction', 'Get Started', 'Tutorials', 'Changelog'] },
    { title: 'Settings', items: ['General', 'Team', 'Billing', 'Limits'] },
  ];
  const projects = ['Design Engineering', 'Sales & Marketing', 'Travel'];
</script>

{#snippet menuButton(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <SidebarMenuButton {...props} size="lg" class="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground">{@render children?.()}</SidebarMenuButton>
{/snippet}

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

{#snippet logo(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <span {...props}>{@render children?.()}</span>
{/snippet}

{#snippet navIcon(title: string)}
  {#if title === 'Playground'}
    <IconPlaceholder lucide="TerminalSquareIcon" tabler="IconTerminal2" hugeicons="ComputerTerminalIcon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
  {:else if title === 'Models'}
    <IconPlaceholder lucide="BotIcon" tabler="IconRobot" hugeicons="RoboticIcon" phosphor="RobotIcon" remixicon="RiRobotLine" />
  {:else if title === 'Documentation'}
    <IconPlaceholder lucide="BookOpen" tabler="IconBook" hugeicons="BookOpen02Icon" phosphor="BookOpenIcon" remixicon="RiBookOpenLine" />
  {:else if title === 'Settings'}
    <IconPlaceholder lucide="Settings2Icon" tabler="IconSettings" hugeicons="Settings05Icon" phosphor="GearIcon" remixicon="RiSettingsLine" />
  {:else if title === 'Design Engineering'}
    <IconPlaceholder lucide="FrameIcon" tabler="IconFrame" hugeicons="CropIcon" phosphor="CropIcon" remixicon="RiCropLine" />
  {:else if title === 'Sales & Marketing'}
    <IconPlaceholder lucide="PieChartIcon" tabler="IconChartPie" hugeicons="PieChartIcon" phosphor="ChartPieIcon" remixicon="RiPieChartLine" />
  {:else}
    <IconPlaceholder lucide="MapIcon" tabler="IconMap" hugeicons="MapsIcon" phosphor="MapTrifoldIcon" remixicon="RiMapLine" />
  {/if}
{/snippet}

<!-- The transform makes this box the containing block of the sidebar's fixed container, so it fills the box and not the window. -->
<div class="relative h-[32rem] w-full transform-gpu overflow-hidden rounded-lg border">
  <SidebarProvider class="h-full min-h-0">
    <Sidebar collapsible="icon" class="absolute h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={menuButton}>
                <Button size="icon-sm" render={logo} nativeButton={false} class="size-8">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></line>
                    <line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></line>
                  </svg>
                </Button>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">{activeTeam.name}</span>
                  <span class="truncate text-xs">{activeTeam.plan}</span>
                </div>
                <IconPlaceholder lucide="ChevronsUpDownIcon" tabler="IconSelector" hugeicons="UnfoldMoreIcon" phosphor="CaretUpDownIcon" remixicon="RiArrowUpDownLine" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Teams</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  {#each teams as team (team.name)}
                    <DropdownMenuItem onclick={() => (activeTeam = team)}>{team.name}</DropdownMenuItem>
                  {/each}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {#each navMain as item (item.title)}
              {#snippet trigger(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
                <SidebarMenuButton {...props} tooltip={item.title}>{@render children?.()}</SidebarMenuButton>
              {/snippet}
              <SidebarMenuItem>
                <Collapsible open={item.isActive} class="group/collapsible">
                  <CollapsibleTrigger render={trigger}>
                    {@render navIcon(item.title)}
                    <span>{item.title}</span>
                    <IconPlaceholder
                      lucide="ChevronRightIcon"
                      tabler="IconChevronRight"
                      hugeicons="ArrowRight01Icon"
                      phosphor="CaretRightIcon"
                      remixicon="RiArrowRightSLine"
                      class="ml-auto transition-transform duration-100 group-data-open/collapsible:rotate-90"
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {#each item.items as subItem (subItem)}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton href="#">{subItem}</SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      {/each}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            {/each}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup class="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {#each projects as name (name)}
              <SidebarMenuItem>
                <SidebarMenuButton render={link}>
                  {@render navIcon(name)}
                  {name}
                </SidebarMenuButton>
              </SidebarMenuItem>
            {/each}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={menuButton}>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback class="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">{user.name}</span>
                  <span class="truncate text-xs">{user.email}</span>
                </div>
                <IconPlaceholder lucide="ChevronsUpDownIcon" tabler="IconSelector" hugeicons="UnfoldMoreIcon" phosphor="CaretUpDownIcon" remixicon="RiArrowUpDownLine" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <Item size="xs">
                      <ItemMedia>
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{user.name}</ItemTitle>
                        <ItemDescription>{user.email}</ItemDescription>
                      </ItemContent>
                    </Item>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Account</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset class="min-w-0 overflow-auto">
      <header class="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="aspect-video rounded-xl bg-muted/50"></div>
          <div class="aspect-video rounded-xl bg-muted/50"></div>
          <div class="aspect-video rounded-xl bg-muted/50"></div>
        </div>
        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</div>
