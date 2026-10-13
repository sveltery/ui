<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Button } from '@sveltery/ui/button';
  import { Popover, PopoverContent, PopoverTrigger } from '@sveltery/ui/popover';
  import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@sveltery/ui/sidebar';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  let isOpen = $state(false);
  onMount(() => {
    isOpen = true;
  });
  const data = [
    [
      {
        label: 'Customize Page',
        icon: settings2Icon,
      },
      {
        label: 'Turn into wiki',
        icon: fileTextIcon,
      },
    ],
    [
      {
        label: 'Copy Link',
        icon: linkIcon,
      },
      {
        label: 'Duplicate',
        icon: copyIcon,
      },
      {
        label: 'Move to',
        icon: cornerUpRightIcon,
      },
      {
        label: 'Move to Trash',
        icon: trash2Icon,
      },
    ],
    [
      {
        label: 'Undo',
        icon: cornerUpLeftIcon,
      },
      {
        label: 'View analytics',
        icon: chartLineIcon,
      },
      {
        label: 'Version History',
        icon: galleryVerticalEndIcon,
      },
      {
        label: 'Show delete pages',
        icon: trashIcon,
      },
      {
        label: 'Notifications',
        icon: bellIcon,
      },
    ],
    [
      {
        label: 'Import',
        icon: arrowUpIcon,
      },
      {
        label: 'Export',
        icon: arrowDownIcon,
      },
    ],
  ];
</script>

{#snippet moreButton(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <Button {...props} variant="ghost" size="icon" class="h-7 w-7 data-open:bg-accent">{@render children?.()}</Button>
{/snippet}

{#snippet settings2Icon()}
  <IconPlaceholder lucide="Settings2Icon" tabler="IconSettings" hugeicons="Settings05Icon" phosphor="GearIcon" remixicon="RiSettingsLine" />
{/snippet}

{#snippet fileTextIcon()}
  <IconPlaceholder lucide="FileTextIcon" tabler="IconFileText" hugeicons="File01Icon" phosphor="FileTextIcon" remixicon="RiFileTextLine" />
{/snippet}

{#snippet linkIcon()}
  <IconPlaceholder lucide="LinkIcon" tabler="IconLink" hugeicons="LinkIcon" phosphor="LinkIcon" remixicon="RiLinksLine" />
{/snippet}

{#snippet copyIcon()}
  <IconPlaceholder lucide="CopyIcon" tabler="IconCopy" hugeicons="Copy01Icon" phosphor="CopyIcon" remixicon="RiFileCopyLine" />
{/snippet}

{#snippet cornerUpRightIcon()}
  <IconPlaceholder lucide="CornerUpRightIcon" tabler="IconCornerUpRight" hugeicons="RedoIcon" phosphor="ArrowBendUpRightIcon" remixicon="RiCornerUpRightLine" />
{/snippet}

{#snippet trash2Icon()}
  <IconPlaceholder lucide="Trash2Icon" tabler="IconTrash" hugeicons="Delete02Icon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
{/snippet}

{#snippet cornerUpLeftIcon()}
  <IconPlaceholder lucide="CornerUpLeftIcon" tabler="IconCornerUpLeft" hugeicons="UndoIcon" phosphor="ArrowBendUpLeftIcon" remixicon="RiCornerUpLeftLine" />
{/snippet}

{#snippet chartLineIcon()}
  <IconPlaceholder lucide="ChartLineIcon" tabler="IconChartLine" hugeicons="ChartIcon" phosphor="ChartLineIcon" remixicon="RiLineChartLine" />
{/snippet}

{#snippet galleryVerticalEndIcon()}
  <IconPlaceholder lucide="GalleryVerticalEndIcon" tabler="IconLayoutRows" hugeicons="LayoutBottomIcon" phosphor="RowsIcon" remixicon="RiGalleryLine" />
{/snippet}

{#snippet trashIcon()}
  <IconPlaceholder lucide="TrashIcon" tabler="IconTrash" hugeicons="DeleteIcon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
{/snippet}

{#snippet bellIcon()}
  <IconPlaceholder lucide="BellIcon" tabler="IconBell" hugeicons="NotificationIcon" phosphor="BellIcon" remixicon="RiNotificationLine" />
{/snippet}

{#snippet arrowUpIcon()}
  <IconPlaceholder lucide="ArrowUpIcon" tabler="IconArrowUp" hugeicons="ArrowUpIcon" phosphor="ArrowUpIcon" remixicon="RiArrowUpLine" />
{/snippet}

{#snippet arrowDownIcon()}
  <IconPlaceholder lucide="ArrowDownIcon" tabler="IconArrowDown" hugeicons="ArrowDownIcon" phosphor="ArrowDownIcon" remixicon="RiArrowDownLine" />
{/snippet}

<div class="flex items-center gap-2 text-sm">
  <div class="hidden font-medium text-muted-foreground md:inline-block">Edit Oct 08</div>
  <Button variant="ghost" size="icon" class="h-7 w-7">
    <IconPlaceholder lucide="StarIcon" tabler="IconStar" hugeicons="StarIcon" phosphor="StarIcon" remixicon="RiStarLine" />
  </Button>
  <Popover bind:open={isOpen} triggerId="nav-actions-trigger">
    <PopoverTrigger id="nav-actions-trigger" render={moreButton}>
      <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDots" hugeicons="MoreHorizontalCircle01Icon" phosphor="DotsThreeOutlineIcon" remixicon="RiMoreLine" />
    </PopoverTrigger>
    <PopoverContent class="w-56 overflow-hidden rounded-lg p-0" align="end">
      <Sidebar collapsible="none" class="bg-transparent">
        <SidebarContent>
          {#each data as group, groupIndex (groupIndex)}
            <SidebarGroup class="border-b last:border-none">
              <SidebarGroupContent class="gap-0">
                <SidebarMenu>
                  {#each group as item (item.label)}
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        {@render item.icon()}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  {/each}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          {/each}
        </SidebarContent>
      </Sidebar>
    </PopoverContent>
  </Popover>
</div>
