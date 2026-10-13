<script lang="ts">
  import { Sidebar, SidebarContent, SidebarGroup, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@sveltery/ui/sidebar';
  let { data } = $props();
</script>
<SidebarProvider defaultOpen={data.open}>
  <Sidebar collapsible="icon">
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Go to inbox" isActive>
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect width="16" height="16" x="4" y="4" /></svg>
              <span>Inbox</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /></svg>
              <span>Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    <header><SidebarTrigger /></header>
    <p>Page content</p>
  </SidebarInset>
</SidebarProvider>
