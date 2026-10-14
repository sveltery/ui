<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@sveltery/ui/sidebar';
  import NavMain from './nav-main.svelte';
  import NavProjects from './nav-projects.svelte';
  import NavUser from './nav-user.svelte';
  import TeamSwitcher from './team-switcher.svelte';

  let { ...props }: ComponentProps<typeof Sidebar> = $props();

  // This is sample data.
  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'Acme Inc',
        logo: galleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: audioLines,
        plan: 'Startup',
      },
      {
        name: 'Evil Corp.',
        logo: terminal,
        plan: 'Free',
      },
    ],
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

{#snippet galleryVerticalEnd()}
  <IconPlaceholder lucide="GalleryVerticalEndIcon" tabler="IconLayoutRows" hugeicons="LayoutBottomIcon" phosphor="RowsIcon" remixicon="RiGalleryLine" />
{/snippet}

{#snippet audioLines()}
  <IconPlaceholder lucide="AudioLinesIcon" tabler="IconWaveSine" hugeicons="AudioWave01Icon" phosphor="WaveformIcon" remixicon="RiPulseLine" />
{/snippet}

{#snippet terminal()}
  <IconPlaceholder lucide="TerminalIcon" tabler="IconCommand" hugeicons="CommandIcon" phosphor="CommandIcon" remixicon="RiCommandLine" />
{/snippet}

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

{#snippet frame()}
  <IconPlaceholder lucide="FrameIcon" tabler="IconFrame" hugeicons="CropIcon" phosphor="CropIcon" remixicon="RiCropLine" />
{/snippet}

{#snippet pieChart()}
  <IconPlaceholder lucide="PieChartIcon" tabler="IconChartPie" hugeicons="PieChartIcon" phosphor="ChartPieIcon" remixicon="RiPieChartLine" />
{/snippet}

{#snippet map()}
  <IconPlaceholder lucide="MapIcon" tabler="IconMap" hugeicons="MapsIcon" phosphor="MapTrifoldIcon" remixicon="RiMapLine" />
{/snippet}

<Sidebar collapsible="icon" {...props}>
  <SidebarHeader>
    <TeamSwitcher teams={data.teams} />
  </SidebarHeader>
  <SidebarContent>
    <NavMain items={data.navMain} />
    <NavProjects projects={data.projects} />
  </SidebarContent>
  <SidebarFooter>
    <NavUser user={data.user} />
  </SidebarFooter>
  <SidebarRail />
</Sidebar>
