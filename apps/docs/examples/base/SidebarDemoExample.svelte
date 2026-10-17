<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { MediaQuery } from 'svelte/reactivity';
  import AudioWaveform from '@lucide/svelte/icons/audio-waveform';
  import BadgeCheck from '@lucide/svelte/icons/badge-check';
  import Bell from '@lucide/svelte/icons/bell';
  import BookOpen from '@lucide/svelte/icons/book-open';
  import Bot from '@lucide/svelte/icons/bot';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
  import Command from '@lucide/svelte/icons/command';
  import CreditCard from '@lucide/svelte/icons/credit-card';
  import Folder from '@lucide/svelte/icons/folder';
  import Forward from '@lucide/svelte/icons/forward';
  import Frame from '@lucide/svelte/icons/frame';
  import GalleryVerticalEnd from '@lucide/svelte/icons/gallery-vertical-end';
  import LogOut from '@lucide/svelte/icons/log-out';
  import Map from '@lucide/svelte/icons/map';
  import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
  import PieChart from '@lucide/svelte/icons/pie-chart';
  import Plus from '@lucide/svelte/icons/plus';
  import Settings2 from '@lucide/svelte/icons/settings-2';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import SquareTerminal from '@lucide/svelte/icons/square-terminal';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import { Avatar, AvatarFallback, AvatarImage } from '$registry/bases/base/ui/avatar';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$registry/bases/base/ui/collapsible';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger
  } from '$registry/bases/base/ui/sidebar';

  // This is sample data.
  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg'
    },
    teams: [
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise'
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup'
      },
      {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free'
      }
    ],
    navMain: [
      {
        title: 'Playground',
        url: '#',
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: 'History',
            url: '#'
          },
          {
            title: 'Starred',
            url: '#'
          },
          {
            title: 'Settings',
            url: '#'
          }
        ]
      },
      {
        title: 'Models',
        url: '#',
        icon: Bot,
        items: [
          {
            title: 'Genesis',
            url: '#'
          },
          {
            title: 'Explorer',
            url: '#'
          },
          {
            title: 'Quantum',
            url: '#'
          }
        ]
      },
      {
        title: 'Documentation',
        url: '#',
        icon: BookOpen,
        items: [
          {
            title: 'Introduction',
            url: '#'
          },
          {
            title: 'Get Started',
            url: '#'
          },
          {
            title: 'Tutorials',
            url: '#'
          },
          {
            title: 'Changelog',
            url: '#'
          }
        ]
      },
      {
        title: 'Settings',
        url: '#',
        icon: Settings2,
        items: [
          {
            title: 'General',
            url: '#'
          },
          {
            title: 'Team',
            url: '#'
          },
          {
            title: 'Billing',
            url: '#'
          },
          {
            title: 'Limits',
            url: '#'
          }
        ]
      }
    ],
    projects: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: Frame
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: PieChart
      },
      {
        name: 'Travel',
        url: '#',
        icon: Map
      }
    ]
  };

  const isMobile = new MediaQuery('max-width: 767px');
  let activeTeam = $state.raw(data.teams[0]);
  type RenderProps = HTMLAttributes<HTMLElement> & { class?: string };
</script>

{#snippet menuButton(props: RenderProps, _state: unknown, children?: Snippet)}
  <SidebarMenuButton {...props} size="lg" class={[props.class, 'data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground']}>{@render children?.()}</SidebarMenuButton>
{/snippet}

{#snippet moreAction(props: RenderProps, _state: unknown, children?: Snippet)}
  <SidebarMenuAction {...props} showOnHover>{@render children?.()}</SidebarMenuAction>
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
                <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <activeTeam.logo class="size-4" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">{activeTeam.name}</span>
                  <span class="truncate text-xs">{activeTeam.plan}</span>
                </div>
                <ChevronsUpDown class="ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-(--anchor-width) min-w-56 rounded-lg" align="start" side={isMobile.current ? 'bottom' : 'right'} sideOffset={4}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel class="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
                  {#each data.teams as team, index (team.name)}
                    <DropdownMenuItem onclick={() => (activeTeam = team)} class="gap-2 p-2">
                      <div class="flex size-6 items-center justify-center rounded-md border">
                        <team.logo class="size-3.5 shrink-0" />
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
                      <Plus class="size-4" />
                    </div>
                    <div class="font-medium text-muted-foreground">Add team</div>
                  </DropdownMenuItem>
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
            {#each data.navMain as item (item.title)}
              {#snippet trigger(props: RenderProps, _state: unknown, children?: Snippet)}
                <SidebarMenuButton {...props} tooltip={item.title}>{@render children?.()}</SidebarMenuButton>
              {/snippet}
              {#snippet menuItem(props: RenderProps, _state: unknown, children?: Snippet)}
                <SidebarMenuItem {...props}>{@render children?.()}</SidebarMenuItem>
              {/snippet}
              <Collapsible open={item.isActive} class="group/collapsible" render={menuItem}>
                <CollapsibleTrigger render={trigger}>
                  <item.icon />
                  <span>{item.title}</span>
                  <ChevronRight class="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
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
              </Collapsible>
            {/each}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup class="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {#each data.projects as item (item.name)}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  {#snippet render(props: RenderProps, _state: unknown, children?: Snippet)}
                    <a href={item.url} {...props}>{@render children?.()}</a>
                  {/snippet}
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger render={moreAction}>
                    <MoreHorizontal />
                    <span class="sr-only">More</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent class="w-48 rounded-lg" side={isMobile.current ? 'bottom' : 'right'} align={isMobile.current ? 'end' : 'start'}>
                    <DropdownMenuItem>
                      <Folder class="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward class="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 class="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            {/each}
            <SidebarMenuItem>
              <SidebarMenuButton class="text-sidebar-foreground/70">
                <MoreHorizontal class="text-sidebar-foreground/70" />
                <span>More</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={menuButton}>
                <Avatar class="h-8 w-8 rounded-lg">
                  <AvatarImage src={data.user.avatar} alt={data.user.name} />
                  <AvatarFallback class="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">{data.user.name}</span>
                  <span class="truncate text-xs">{data.user.email}</span>
                </div>
                <ChevronsUpDown class="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-(--anchor-width) min-w-56 rounded-lg" side={isMobile.current ? 'bottom' : 'right'} align="end" sideOffset={4}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel class="p-0 font-normal">
                    <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar class="h-8 w-8 rounded-lg">
                        <AvatarImage src={data.user.avatar} alt={data.user.name} />
                        <AvatarFallback class="rounded-lg">CN</AvatarFallback>
                      </Avatar>
                      <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate font-medium">{data.user.name}</span>
                        <span class="truncate text-xs">{data.user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset class="min-w-0 overflow-auto">
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
        </div>
      </header>
    </SidebarInset>
  </SidebarProvider>
</div>
