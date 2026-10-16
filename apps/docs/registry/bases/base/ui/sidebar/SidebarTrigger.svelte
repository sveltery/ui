<script lang="ts">
  import { cn } from 'cn';
  import { Button } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  import { useSidebar } from './context.js';
  import type { SidebarTriggerProps } from './types.js';
  let { class: classProp, onclick, ...props }: SidebarTriggerProps = $props();
  const sidebar = useSidebar();
</script>
<Button
  data-sidebar="trigger"
  data-slot="sidebar-trigger"
  variant="ghost"
  size="icon-sm"
  {...props}
  class={cn('cn-sidebar-trigger', classProp)}
  onclick={event => {
    onclick?.(event);
    sidebar.toggleSidebar();
  }}
>
  <IconPlaceholder lucide="PanelLeftIcon" tabler="IconLayoutSidebar" hugeicons="SidebarLeftIcon" phosphor="SidebarIcon" remixicon="RiSideBarLine" class="cn-rtl-flip" />
  <span class="sr-only">Toggle Sidebar</span>
</Button>
