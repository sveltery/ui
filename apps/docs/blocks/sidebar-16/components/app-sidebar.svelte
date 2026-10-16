<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    type SidebarProps,
  } from '@sveltery/components/sidebar';
  import NavMain from './nav-main.svelte';
  import NavProjects from './nav-projects.svelte';
  import NavSecondary from './nav-secondary.svelte';
  import NavUser from './nav-user.svelte';
  import { IconPlaceholder } from '@sveltery/components/icons';
  let { ...props }: SidebarProps = $props();
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
        icon: terminalSquareIcon,
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
        icon: botIcon,
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
        icon: bookOpenIcon,
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
        icon: settings2Icon,
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
        icon: lifeBuoyIcon,
      },
      {
        title: 'Feedback',
        url: '#',
        icon: sendIcon,
      },
    ],
    projects: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: frameIcon,
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: pieChartIcon,
      },
      {
        name: 'Travel',
        url: '#',
        icon: mapIcon,
      },
    ],
  };
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

{#snippet terminalSquareIcon()}
  <IconPlaceholder lucide="TerminalSquareIcon" tabler="IconTerminal2" hugeicons="ComputerTerminalIcon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
{/snippet}

{#snippet botIcon()}
  <IconPlaceholder lucide="BotIcon" tabler="IconRobot" hugeicons="RoboticIcon" phosphor="RobotIcon" remixicon="RiRobotLine" />
{/snippet}

{#snippet bookOpenIcon()}
  <IconPlaceholder lucide="BookOpenIcon" tabler="IconBook" hugeicons="BookOpen02Icon" phosphor="BookOpenIcon" remixicon="RiBookOpenLine" />
{/snippet}

{#snippet settings2Icon()}
  <IconPlaceholder lucide="Settings2Icon" tabler="IconSettings" hugeicons="Settings05Icon" phosphor="GearIcon" remixicon="RiSettingsLine" />
{/snippet}

{#snippet lifeBuoyIcon()}
  <IconPlaceholder lucide="LifeBuoyIcon" tabler="IconLifebuoy" hugeicons="ChartRingIcon" phosphor="LifebuoyIcon" remixicon="RiLifebuoyLine" />
{/snippet}

{#snippet sendIcon()}
  <IconPlaceholder lucide="SendIcon" tabler="IconSend" hugeicons="SentIcon" phosphor="PaperPlaneTiltIcon" remixicon="RiSendPlaneLine" />
{/snippet}

{#snippet frameIcon()}
  <IconPlaceholder lucide="FrameIcon" tabler="IconFrame" hugeicons="CropIcon" phosphor="CropIcon" remixicon="RiCropLine" />
{/snippet}

{#snippet pieChartIcon()}
  <IconPlaceholder lucide="PieChartIcon" tabler="IconChartPie" hugeicons="PieChartIcon" phosphor="ChartPieIcon" remixicon="RiPieChartLine" />
{/snippet}

{#snippet mapIcon()}
  <IconPlaceholder lucide="MapIcon" tabler="IconMap" hugeicons="MapsIcon" phosphor="MapTrifoldIcon" remixicon="RiMapLine" />
{/snippet}

{#snippet link(props: RenderProps, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

<Sidebar class="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" render={link}>
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <IconPlaceholder
              lucide="TerminalIcon"
              tabler="IconCommand"
              hugeicons="CommandIcon"
              phosphor="CommandIcon"
              remixicon="RiCommandLine"
              class="size-4"
            />
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

