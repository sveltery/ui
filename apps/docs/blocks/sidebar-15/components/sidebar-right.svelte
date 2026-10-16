<script lang="ts">
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    type SidebarProps,
  } from '@sveltery/components/sidebar';
  import Calendars from './calendars.svelte';
  import DatePicker from './date-picker.svelte';
  import NavUser from './nav-user.svelte';
  import { IconPlaceholder } from '@sveltery/components/icons';
  let { ...props }: SidebarProps = $props();
  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    calendars: [
      {
        name: 'My Calendars',
        items: ['Personal', 'Work', 'Family'],
      },
      {
        name: 'Favorites',
        items: ['Holidays', 'Birthdays'],
      },
      {
        name: 'Other',
        items: ['Travel', 'Reminders', 'Deadlines'],
      },
    ],
  };
</script>

<Sidebar
  collapsible="none"
  class="sticky top-0 hidden h-svh border-l lg:flex"
  {...props}
>
  <SidebarHeader class="h-16 border-b border-sidebar-border">
    <NavUser user={data.user} />
  </SidebarHeader>
  <SidebarContent>
    <DatePicker />
    <SidebarSeparator class="mx-0" />
    <Calendars calendars={data.calendars} />
  </SidebarContent>
  <SidebarFooter>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
          />
          <span>New Calendar</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarFooter>
</Sidebar>

