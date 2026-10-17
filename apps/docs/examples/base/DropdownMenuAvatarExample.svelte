<script lang="ts">
  import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
  import BellIcon from '@lucide/svelte/icons/bell';
  import CreditCardIcon from '@lucide/svelte/icons/credit-card';
  import LogOutIcon from '@lucide/svelte/icons/log-out';
  import { Avatar, AvatarFallback, AvatarImage } from '$registry/bases/base/ui/avatar';
  import { Button } from '$registry/bases/base/ui/button';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '$registry/bases/base/ui/dropdown-menu';
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet render(props, _state, content)}<Button variant="ghost" size="icon" class="rounded-full" {...props}>{@render content?.()}</Button>{/snippet}
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>LR</AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <BadgeCheckIcon />
        Account
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CreditCardIcon />
        Billing
      </DropdownMenuItem>
      <DropdownMenuItem>
        <BellIcon />
        Notifications
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <LogOutIcon />
      Sign Out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
