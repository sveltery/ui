<script lang="ts">
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@sveltery/components/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@sveltery/components/sidebar';

  let { versions, defaultVersion }: { versions: string[]; defaultVersion: string } = $props();
  // svelte-ignore state_referenced_locally
  let selectedVersion = $state(defaultVersion);
</script>

<SidebarMenu>
  <SidebarMenuItem>
    <DropdownMenu>
      <DropdownMenuTrigger>
        {#snippet render(props, _state, children)}
          <SidebarMenuButton {...props} size="lg" class={[props.class, 'data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground']}>{@render children?.()}</SidebarMenuButton>
        {/snippet}
        <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <IconPlaceholder lucide="GalleryVerticalEndIcon" tabler="IconLayoutRows" hugeicons="LayoutBottomIcon" phosphor="RowsIcon" remixicon="RiGalleryLine" class="size-4" />
        </div>
        <div class="flex flex-col gap-0.5 leading-none">
          <span class="font-medium">Documentation</span>
          <span class="">v{selectedVersion}</span>
        </div>
        <IconPlaceholder lucide="ChevronsUpDownIcon" tabler="IconSelector" hugeicons="UnfoldMoreIcon" phosphor="CaretUpDownIcon" remixicon="RiArrowUpDownLine" class="ml-auto" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {#each versions as version (version)}
          <!-- Upstream passes onSelect, which Base UI menu items do not call; onclick is what selects. -->
          <DropdownMenuItem onclick={() => (selectedVersion = version)}>
            v{version}
            {#if version === selectedVersion}
              <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" class="ml-auto" />
            {/if}
          </DropdownMenuItem>
        {/each}
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
</SidebarMenu>
