<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Avatar, AvatarFallback, AvatarImage } from '@sveltery/ui/avatar';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@sveltery/ui/sidebar';

  let { user }: { user: { name: string; email: string; avatar: string } } = $props();
  const sidebar = useSidebar();
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

{#snippet menuButton(props: RenderProps, _state: unknown, children?: Snippet)}
  <SidebarMenuButton {...props} size="lg" class={[props.class, 'aria-expanded:bg-muted']}>{@render children?.()}</SidebarMenuButton>
{/snippet}

<SidebarMenu>
  <SidebarMenuItem>
    <DropdownMenu>
      <DropdownMenuTrigger render={menuButton}>
        <Avatar class="size-8 rounded-lg grayscale">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback class="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">{user.name}</span>
          <span class="truncate text-xs text-foreground/70">{user.email}</span>
        </div>
        <IconPlaceholder lucide="EllipsisVerticalIcon" tabler="IconDotsVertical" hugeicons="MoreVerticalCircle01Icon" phosphor="DotsThreeVerticalIcon" remixicon="RiMore2Line" class="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-56" side={sidebar.isMobile ? 'bottom' : 'right'} align="end" sideOffset={4}>
        <DropdownMenuGroup>
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="size-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback class="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">{user.name}</span>
                <span class="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconPlaceholder lucide="CircleUserRoundIcon" tabler="IconUserCircle" hugeicons="UserCircle02Icon" phosphor="UserCircleIcon" remixicon="RiUserLine" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder lucide="CreditCardIcon" tabler="IconCreditCard" hugeicons="CreditCardIcon" phosphor="CreditCardIcon" remixicon="RiBankCardLine" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder lucide="BellIcon" tabler="IconNotification" hugeicons="Notification03Icon" phosphor="BellIcon" remixicon="RiNotification3Line" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <IconPlaceholder lucide="LogOutIcon" tabler="IconLogout" hugeicons="Logout01Icon" phosphor="SignOutIcon" remixicon="RiLogoutBoxLine" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
</SidebarMenu>
