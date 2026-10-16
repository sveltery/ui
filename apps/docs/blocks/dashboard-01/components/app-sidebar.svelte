<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '$registry/bases/base/ui/sidebar';
  import NavDocuments from './nav-documents.svelte';
  import NavMain from './nav-main.svelte';
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
      { title: 'Dashboard', url: '#', icon: dashboard },
      { title: 'Lifecycle', url: '#', icon: list },
      { title: 'Analytics', url: '#', icon: chartBar },
      { title: 'Projects', url: '#', icon: folder },
      { title: 'Team', url: '#', icon: users },
    ],
    navClouds: [
      {
        title: 'Capture',
        icon: camera,
        isActive: true,
        url: '#',
        items: [
          { title: 'Active Proposals', url: '#' },
          { title: 'Archived', url: '#' },
        ],
      },
      {
        title: 'Proposal',
        icon: fileText,
        url: '#',
        items: [
          { title: 'Active Proposals', url: '#' },
          { title: 'Archived', url: '#' },
        ],
      },
      {
        title: 'Prompts',
        icon: fileAi,
        url: '#',
        items: [
          { title: 'Active Proposals', url: '#' },
          { title: 'Archived', url: '#' },
        ],
      },
    ],
    navSecondary: [
      { title: 'Settings', url: '#', icon: settings },
      { title: 'Get Help', url: '#', icon: help },
      { title: 'Search', url: '#', icon: search },
    ],
    documents: [
      { name: 'Data Library', url: '#', icon: database },
      { name: 'Reports', url: '#', icon: report },
      { name: 'Word Assistant', url: '#', icon: file },
    ],
  };
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

{#snippet dashboard()}
  <IconPlaceholder lucide="LayoutDashboardIcon" tabler="IconDashboard" hugeicons="DashboardSquare01Icon" phosphor="SquaresFourIcon" remixicon="RiDashboardLine" />
{/snippet}

{#snippet list()}
  <IconPlaceholder lucide="ListIcon" tabler="IconListDetails" hugeicons="Menu01Icon" phosphor="ListIcon" remixicon="RiListUnordered" />
{/snippet}

{#snippet chartBar()}
  <IconPlaceholder lucide="ChartBarIcon" tabler="IconChartBar" hugeicons="ChartHistogramIcon" phosphor="ChartBarIcon" remixicon="RiBarChartLine" />
{/snippet}

{#snippet folder()}
  <IconPlaceholder lucide="FolderIcon" tabler="IconFolder" hugeicons="Folder01Icon" phosphor="FolderIcon" remixicon="RiFolderLine" />
{/snippet}

{#snippet users()}
  <IconPlaceholder lucide="UsersIcon" tabler="IconUsers" hugeicons="UserGroupIcon" phosphor="UsersIcon" remixicon="RiGroupLine" />
{/snippet}

{#snippet camera()}
  <IconPlaceholder lucide="CameraIcon" tabler="IconCamera" hugeicons="Camera01Icon" phosphor="CameraIcon" remixicon="RiCameraLine" />
{/snippet}

{#snippet fileText()}
  <IconPlaceholder lucide="FileTextIcon" tabler="IconFileDescription" hugeicons="File01Icon" phosphor="FileTextIcon" remixicon="RiFileTextLine" />
{/snippet}

{#snippet fileAi()}
  <IconPlaceholder lucide="FileTextIcon" tabler="IconFileAi" hugeicons="File01Icon" phosphor="FileTextIcon" remixicon="RiFileTextLine" />
{/snippet}

{#snippet settings()}
  <IconPlaceholder lucide="Settings2Icon" tabler="IconSettings" hugeicons="Settings05Icon" phosphor="GearIcon" remixicon="RiSettingsLine" />
{/snippet}

{#snippet help()}
  <IconPlaceholder lucide="CircleHelpIcon" tabler="IconHelp" hugeicons="HelpCircleIcon" phosphor="QuestionIcon" remixicon="RiQuestionLine" />
{/snippet}

{#snippet search()}
  <IconPlaceholder lucide="SearchIcon" tabler="IconSearch" hugeicons="SearchIcon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" />
{/snippet}

{#snippet database()}
  <IconPlaceholder lucide="DatabaseIcon" tabler="IconDatabase" hugeicons="Database01Icon" phosphor="DatabaseIcon" remixicon="RiDatabase2Line" />
{/snippet}

{#snippet report()}
  <IconPlaceholder lucide="FileChartColumnIcon" tabler="IconReport" hugeicons="Analytics01Icon" phosphor="ChartLineIcon" remixicon="RiFileChartLine" />
{/snippet}

{#snippet file()}
  <IconPlaceholder lucide="FileIcon" tabler="IconFileWord" hugeicons="File01Icon" phosphor="FileIcon" remixicon="RiFileLine" />
{/snippet}

{#snippet link(props: RenderProps, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

<Sidebar collapsible="offcanvas" {...props}>
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton class="data-[slot=sidebar-menu-button]:p-1.5!" render={link}>
          <IconPlaceholder lucide="CommandIcon" tabler="IconInnerShadowTop" hugeicons="CommandIcon" phosphor="CommandIcon" remixicon="RiCommandLine" class="size-5!" />
          <span class="text-base font-semibold">Acme Inc.</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
  <SidebarContent>
    <NavMain items={data.navMain} />
    <NavDocuments items={data.documents} />
    <NavSecondary items={data.navSecondary} class="mt-auto" />
  </SidebarContent>
  <SidebarFooter>
    <NavUser user={data.user} />
  </SidebarFooter>
</Sidebar>
