<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@sveltery/ui/sidebar';
  import NavMain from './nav-main.svelte';
  import NavProjects from './nav-projects.svelte';
  import NavSecondary from './nav-secondary.svelte';
  import NavUser from './nav-user.svelte';

  let { ...props }: ComponentProps<typeof Sidebar> = $props();

  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: 'Playground',
        url: '#',
        icon: terminalSquare,
        isActive: true,
        items: [
          {
            title: 'History',
            url: '#',
          },
          {
            title: 'Starred',
            url: '#',
          },
          {
            title: 'Settings',
            url: '#',
          },
        ],
      },
      {
        title: 'Models',
        url: '#',
        icon: bot,
        items: [
          {
            title: 'Genesis',
            url: '#',
          },
          {
            title: 'Explorer',
            url: '#',
          },
          {
            title: 'Quantum',
            url: '#',
          },
        ],
      },
      {
        title: 'Documentation',
        url: '#',
        icon: bookOpen,
        items: [
          {
            title: 'Introduction',
            url: '#',
          },
          {
            title: 'Get Started',
            url: '#',
          },
          {
            title: 'Tutorials',
            url: '#',
          },
          {
            title: 'Changelog',
            url: '#',
          },
        ],
      },
      {
        title: 'Settings',
        url: '#',
        icon: settings2,
        items: [
          {
            title: 'General',
            url: '#',
          },
          {
            title: 'Team',
            url: '#',
          },
          {
            title: 'Billing',
            url: '#',
          },
          {
            title: 'Limits',
            url: '#',
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: 'Support',
        url: '#',
        icon: lifeBuoy,
      },
      {
        title: 'Feedback',
        url: '#',
        icon: send,
      },
    ],
    projects: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: frame,
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: pieChart,
      },
      {
        name: 'Travel',
        url: '#',
        icon: map,
      },
    ],
  }
</script>

{#snippet terminalSquare()}
  <IconPlaceholder lucide="TerminalSquareIcon" tabler="IconTerminal2" hugeicons="ComputerTerminalIcon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
{/snippet}

{#snippet bot()}
  <IconPlaceholder lucide="BotIcon" tabler="IconRobot" hugeicons="RoboticIcon" phosphor="RobotIcon" remixicon="RiRobotLine" />
{/snippet}

{#snippet bookOpen()}
  <IconPlaceholder lucide="BookOpenIcon" tabler="IconBook" hugeicons="BookOpen02Icon" phosphor="BookOpenIcon" remixicon="RiBookOpenLine" />
{/snippet}

{#snippet settings2()}
  <IconPlaceholder lucide="Settings2Icon" tabler="IconSettings" hugeicons="Settings05Icon" phosphor="GearIcon" remixicon="RiSettingsLine" />
{/snippet}

{#snippet lifeBuoy()}
  <IconPlaceholder lucide="LifeBuoyIcon" tabler="IconLifebuoy" hugeicons="ChartRingIcon" phosphor="LifebuoyIcon" remixicon="RiLifebuoyLine" />
{/snippet}

{#snippet send()}
  <IconPlaceholder lucide="SendIcon" tabler="IconSend" hugeicons="SentIcon" phosphor="PaperPlaneTiltIcon" remixicon="RiSendPlaneLine" />
{/snippet}

{#snippet frame()}
  <IconPlaceholder lucide="FrameIcon" tabler="IconFrame" hugeicons="CropIcon" phosphor="CropIcon" remixicon="RiCropLine" />
{/snippet}

{#snippet pieChart()}
  <IconPlaceholder lucide="PieChartIcon" tabler="IconChartPie" hugeicons="PieChartIcon" phosphor="ChartPieIcon" remixicon="RiPieChartLine" />
{/snippet}

{#snippet map()}
  <IconPlaceholder lucide="MapIcon" tabler="IconMap" hugeicons="MapsIcon" phosphor="MapTrifoldIcon" remixicon="RiMapLine" />
{/snippet}

{#snippet home(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

<Sidebar variant="inset" {...props}>
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" render={home}>
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <IconPlaceholder lucide="TerminalIcon" tabler="IconCommand" hugeicons="CommandIcon" phosphor="CommandIcon" remixicon="RiCommandLine" class="size-4" />
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-medium">Acme Inc</span>
            <span class="truncate text-xs">Enterprise</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
  <SidebarContent>
    <NavMain items={data.navMain} />
    <NavProjects projects={data.projects} />
    <NavSecondary items={data.navSecondary} class="mt-auto" />
  </SidebarContent>
  <SidebarFooter>
    <NavUser user={data.user} />
  </SidebarFooter>
</Sidebar>
