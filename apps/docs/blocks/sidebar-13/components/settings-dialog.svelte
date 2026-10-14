<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@sveltery/ui/breadcrumb';
  import { Button } from '@sveltery/ui/button';
  import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@sveltery/ui/dialog';
  import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@sveltery/ui/sidebar';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  let open = $state(true);
  const data = {
    nav: [
      {
        name: 'Notifications',
        icon: bellIcon,
      },
      {
        name: 'Navigation',
        icon: menuIcon,
      },
      {
        name: 'Home',
        icon: homeIcon,
      },
      {
        name: 'Appearance',
        icon: paintbrushIcon,
      },
      {
        name: 'Messages & media',
        icon: messageCircleIcon,
      },
      {
        name: 'Language & region',
        icon: globeIcon,
      },
      {
        name: 'Accessibility',
        icon: keyboardIcon,
      },
      {
        name: 'Mark as read',
        icon: checkIcon,
      },
      {
        name: 'Audio & video',
        icon: videoIcon,
      },
      {
        name: 'Connected accounts',
        icon: linkIcon,
      },
      {
        name: 'Privacy & visibility',
        icon: lockIcon,
      },
      {
        name: 'Advanced',
        icon: settingsIcon,
      },
    ],
  };
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

{#snippet bellIcon()}
  <IconPlaceholder lucide="BellIcon" tabler="IconBell" hugeicons="NotificationIcon" phosphor="BellIcon" remixicon="RiNotificationLine" />
{/snippet}

{#snippet menuIcon()}
  <IconPlaceholder lucide="MenuIcon" tabler="IconMenu" hugeicons="Menu09Icon" phosphor="ListIcon" remixicon="RiMenuLine" />
{/snippet}

{#snippet homeIcon()}
  <IconPlaceholder lucide="HomeIcon" tabler="IconHome" hugeicons="HomeIcon" phosphor="HouseIcon" remixicon="RiHomeLine" />
{/snippet}

{#snippet paintbrushIcon()}
  <IconPlaceholder lucide="PaintbrushIcon" tabler="IconPalette" hugeicons="PaintBoardIcon" phosphor="PaletteIcon" remixicon="RiPaletteLine" />
{/snippet}

{#snippet messageCircleIcon()}
  <IconPlaceholder lucide="MessageCircleIcon" tabler="IconMessageQuestion" hugeicons="MessageIcon" phosphor="ChatCircleIcon" remixicon="RiChat1Line" />
{/snippet}

{#snippet globeIcon()}
  <IconPlaceholder lucide="GlobeIcon" tabler="IconWorld" hugeicons="Globe02Icon" phosphor="GlobeIcon" remixicon="RiGlobalLine" />
{/snippet}

{#snippet keyboardIcon()}
  <IconPlaceholder lucide="KeyboardIcon" tabler="IconKeyboard" hugeicons="KeyboardIcon" phosphor="KeyboardIcon" remixicon="RiKeyboardLine" />
{/snippet}

{#snippet checkIcon()}
  <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" />
{/snippet}

{#snippet videoIcon()}
  <IconPlaceholder lucide="VideoIcon" tabler="IconVideoPlus" hugeicons="RecordIcon" phosphor="VideoIcon" remixicon="RiVideoLine" />
{/snippet}

{#snippet linkIcon()}
  <IconPlaceholder lucide="LinkIcon" tabler="IconLink" hugeicons="LinkIcon" phosphor="LinkIcon" remixicon="RiLinksLine" />
{/snippet}

{#snippet lockIcon()}
  <IconPlaceholder lucide="LockIcon" tabler="IconLock" hugeicons="ShieldIcon" phosphor="LockIcon" remixicon="RiLockLine" />
{/snippet}

{#snippet settingsIcon()}
  <IconPlaceholder lucide="SettingsIcon" tabler="IconSettings" hugeicons="SettingsIcon" phosphor="GearIcon" remixicon="RiSettingsLine" />
{/snippet}

{#snippet link(props: RenderProps, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

{#snippet triggerButton(props: RenderProps, _state: unknown, children?: Snippet)}
  <Button {...props} size="sm">{@render children?.()}</Button>
{/snippet}

<Dialog bind:open>
  <DialogTrigger render={triggerButton}>Open Dialog</DialogTrigger>
  <DialogContent class="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
    <DialogTitle class="sr-only">Settings</DialogTitle>
    <DialogDescription class="sr-only">Customize your settings here.</DialogDescription>
    <SidebarProvider class="items-start">
      <Sidebar collapsible="none" class="hidden md:flex">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {#each data.nav as item (item.name)}
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={item.name === 'Messages & media'} render={link}>
                      {@render item.icon()}
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                {/each}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main class="flex h-[480px] flex-1 flex-col overflow-hidden">
        <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div class="flex items-center gap-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Messages & media</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
          {#each { length: 10 } as _, i (i)}
            <div class="aspect-video max-w-3xl rounded-xl bg-muted/50"></div>
          {/each}
        </div>
      </main>
    </SidebarProvider>
  </DialogContent>
</Dialog>
