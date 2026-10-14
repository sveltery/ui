<script lang="ts">
  import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, type SidebarProps } from '@sveltery/ui/sidebar';
  import NavFavorites from './nav-favorites.svelte';
  import NavMain from './nav-main.svelte';
  import NavSecondary from './nav-secondary.svelte';
  import NavWorkspaces from './nav-workspaces.svelte';
  import TeamSwitcher from './team-switcher.svelte';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  let { ...props }: SidebarProps = $props();
  const data = {
    teams: [
      {
        name: 'Acme Inc',
        logo: terminalIcon,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: audioLinesIcon,
        plan: 'Startup',
      },
      {
        name: 'Evil Corp.',
        logo: terminalIcon,
        plan: 'Free',
      },
    ],
    navMain: [
      {
        title: 'Search',
        url: '#',
        icon: searchIcon,
      },
      {
        title: 'Ask AI',
        url: '#',
        icon: sparklesIcon,
      },
      {
        title: 'Home',
        url: '#',
        icon: homeIcon,
        isActive: true,
      },
      {
        title: 'Inbox',
        url: '#',
        icon: inboxIcon,
        badge: '10',
      },
    ],
    navSecondary: [
      {
        title: 'Calendar',
        url: '#',
        icon: calendarIcon,
      },
      {
        title: 'Settings',
        url: '#',
        icon: settings2Icon,
      },
      {
        title: 'Templates',
        url: '#',
        icon: blocksIcon,
      },
      {
        title: 'Trash',
        url: '#',
        icon: trash2Icon,
      },
      {
        title: 'Help',
        url: '#',
        icon: messageCircleQuestionIcon,
      },
    ],
    favorites: [
      {
        name: 'Project Management & Task Tracking',
        url: '#',
        emoji: '📊',
      },
      {
        name: 'Family Recipe Collection & Meal Planning',
        url: '#',
        emoji: '🍳',
      },
      {
        name: 'Fitness Tracker & Workout Routines',
        url: '#',
        emoji: '💪',
      },
      {
        name: 'Book Notes & Reading List',
        url: '#',
        emoji: '📚',
      },
      {
        name: 'Sustainable Gardening Tips & Plant Care',
        url: '#',
        emoji: '🌱',
      },
      {
        name: 'Language Learning Progress & Resources',
        url: '#',
        emoji: '🗣️',
      },
      {
        name: 'Home Renovation Ideas & Budget Tracker',
        url: '#',
        emoji: '🏠',
      },
      {
        name: 'Personal Finance & Investment Portfolio',
        url: '#',
        emoji: '💰',
      },
      {
        name: 'Movie & TV Show Watchlist with Reviews',
        url: '#',
        emoji: '🎬',
      },
      {
        name: 'Daily Habit Tracker & Goal Setting',
        url: '#',
        emoji: '✅',
      },
    ],
    workspaces: [
      {
        name: 'Personal Life Management',
        emoji: '🏠',
        pages: [
          {
            name: 'Daily Journal & Reflection',
            url: '#',
            emoji: '📔',
          },
          {
            name: 'Health & Wellness Tracker',
            url: '#',
            emoji: '🍏',
          },
          {
            name: 'Personal Growth & Learning Goals',
            url: '#',
            emoji: '🌟',
          },
        ],
      },
      {
        name: 'Professional Development',
        emoji: '💼',
        pages: [
          {
            name: 'Career Objectives & Milestones',
            url: '#',
            emoji: '🎯',
          },
          {
            name: 'Skill Acquisition & Training Log',
            url: '#',
            emoji: '🧠',
          },
          {
            name: 'Networking Contacts & Events',
            url: '#',
            emoji: '🤝',
          },
        ],
      },
      {
        name: 'Creative Projects',
        emoji: '🎨',
        pages: [
          {
            name: 'Writing Ideas & Story Outlines',
            url: '#',
            emoji: '✍️',
          },
          {
            name: 'Art & Design Portfolio',
            url: '#',
            emoji: '🖼️',
          },
          {
            name: 'Music Composition & Practice Log',
            url: '#',
            emoji: '🎵',
          },
        ],
      },
      {
        name: 'Home Management',
        emoji: '🏡',
        pages: [
          {
            name: 'Household Budget & Expense Tracking',
            url: '#',
            emoji: '💰',
          },
          {
            name: 'Home Maintenance Schedule & Tasks',
            url: '#',
            emoji: '🔧',
          },
          {
            name: 'Family Calendar & Event Planning',
            url: '#',
            emoji: '📅',
          },
        ],
      },
      {
        name: 'Travel & Adventure',
        emoji: '🧳',
        pages: [
          {
            name: 'Trip Planning & Itineraries',
            url: '#',
            emoji: '🗺️',
          },
          {
            name: 'Travel Bucket List & Inspiration',
            url: '#',
            emoji: '🌎',
          },
          {
            name: 'Travel Journal & Photo Gallery',
            url: '#',
            emoji: '📸',
          },
        ],
      },
    ],
  };
</script>

{#snippet terminalIcon()}
  <IconPlaceholder lucide="TerminalIcon" tabler="IconCommand" hugeicons="CommandIcon" phosphor="CommandIcon" remixicon="RiCommandLine" />
{/snippet}

{#snippet audioLinesIcon()}
  <IconPlaceholder lucide="AudioLinesIcon" tabler="IconWaveSine" hugeicons="AudioWave01Icon" phosphor="WaveformIcon" remixicon="RiPulseLine" />
{/snippet}

{#snippet searchIcon()}
  <IconPlaceholder lucide="SearchIcon" tabler="IconSearch" hugeicons="SearchIcon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" />
{/snippet}

{#snippet sparklesIcon()}
  <IconPlaceholder lucide="SparklesIcon" tabler="IconSparkles" hugeicons="SparklesIcon" phosphor="SparkleIcon" remixicon="RiSparklingLine" />
{/snippet}

{#snippet homeIcon()}
  <IconPlaceholder lucide="HomeIcon" tabler="IconHome" hugeicons="HomeIcon" phosphor="HouseIcon" remixicon="RiHomeLine" />
{/snippet}

{#snippet inboxIcon()}
  <IconPlaceholder lucide="InboxIcon" tabler="IconInbox" hugeicons="InboxIcon" phosphor="TrayIcon" remixicon="RiInboxLine" />
{/snippet}

{#snippet calendarIcon()}
  <IconPlaceholder lucide="CalendarIcon" tabler="IconCalendar" hugeicons="CalendarIcon" phosphor="CalendarIcon" remixicon="RiCalendarLine" />
{/snippet}

{#snippet settings2Icon()}
  <IconPlaceholder lucide="Settings2Icon" tabler="IconSettings" hugeicons="Settings05Icon" phosphor="GearIcon" remixicon="RiSettingsLine" />
{/snippet}

{#snippet blocksIcon()}
  <IconPlaceholder lucide="BlocksIcon" tabler="IconCube" hugeicons="CubeIcon" phosphor="CubeIcon" remixicon="RiBox3Line" />
{/snippet}

{#snippet trash2Icon()}
  <IconPlaceholder lucide="Trash2Icon" tabler="IconTrash" hugeicons="Delete02Icon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
{/snippet}

{#snippet messageCircleQuestionIcon()}
  <IconPlaceholder lucide="MessageCircleQuestionIcon" tabler="IconMessageQuestion" hugeicons="MessageQuestionIcon" phosphor="ChatCircleIcon" remixicon="RiQuestionLine" />
{/snippet}

<Sidebar class="border-r-0" {...props}>
  <SidebarHeader>
    <TeamSwitcher teams={data.teams} />
    <NavMain items={data.navMain} />
  </SidebarHeader>
  <SidebarContent>
    <NavFavorites favorites={data.favorites} />
    <NavWorkspaces workspaces={data.workspaces} />
    <NavSecondary items={data.navSecondary} class="mt-auto" />
  </SidebarContent>
  <SidebarRail />
</Sidebar>

