<script lang="ts">
  import BellIcon from '@lucide/svelte/icons/bell';
  import MailIcon from '@lucide/svelte/icons/mail';
  import MessageSquareIcon from '@lucide/svelte/icons/message-square';
  import { Button } from '$registry/bases/base/ui/button';
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';

  let notifications = $state({ email: true, sms: false, push: true });
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Notifications
  </DropdownMenuTrigger>
  <DropdownMenuContent class="w-48">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
      <DropdownMenuCheckboxItem bind:checked={notifications.email}>
        <MailIcon />
        Email notifications
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem bind:checked={notifications.sms}>
        <MessageSquareIcon />
        SMS notifications
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem bind:checked={notifications.push}>
        <BellIcon />
        Push notifications
      </DropdownMenuCheckboxItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
