<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@sveltery/ui/sidebar';

  let { versions, defaultVersion }: { versions: string[]; defaultVersion: string } = $props();
  // svelte-ignore state_referenced_locally
  let selectedVersion = $state(defaultVersion);
</script>

{#snippet menuButton(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <SidebarMenuButton {...props} size="lg" class="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground">{@render children?.()}</SidebarMenuButton>
{/snippet}

<SidebarMenu>
  <SidebarMenuItem>
    <DropdownMenu>
      <DropdownMenuTrigger render={menuButton}>
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
