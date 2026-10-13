<script lang="ts">
  import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@sveltery/ui/breadcrumb';
  import { Button } from '@sveltery/ui/button';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Separator } from '@sveltery/ui/separator';
  import { useSidebar } from '@sveltery/ui/sidebar';
  import SearchForm from './search-form.svelte';

  const sidebar = useSidebar();
</script>

<header class="sticky top-0 z-50 flex w-full items-center border-b bg-background">
  <div class="flex h-(--header-height) w-full items-center gap-2 px-4">
    <Button class="h-8 w-8" variant="ghost" size="icon" onclick={sidebar.toggleSidebar}>
      <IconPlaceholder lucide="PanelLeftIcon" tabler="IconLayoutSidebar" hugeicons="SidebarLeftIcon" phosphor="SidebarIcon" remixicon="RiLayoutLeftLine" />
    </Button>
    <Separator orientation="vertical" class="mr-2 data-vertical:h-4 data-vertical:self-auto" />
    <Breadcrumb class="hidden sm:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <SearchForm class="w-full sm:ml-auto sm:w-auto" />
  </div>
</header>
