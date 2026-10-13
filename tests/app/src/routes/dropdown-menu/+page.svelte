<script lang="ts">
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
  } from '@sveltery/ui/dropdown-menu';

  let last = $state('none');
  let statusBar = $state(true);
  let position = $state('bottom');
</script>
<div class="flex gap-8 p-16">
  <DropdownMenu>
    <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem onclick={() => (last = 'Profile')}>Profile<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuItem onclick={() => (last = 'Billing')}>Billing</DropdownMenuItem>
        <DropdownMenuItem onclick={() => (last = 'Settings')}>Settings</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem onclick={() => (last = 'Email')}>Email</DropdownMenuItem>
            <DropdownMenuItem onclick={() => (last = 'Message')}>Message</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" onclick={() => (last = 'Delete')}>Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <DropdownMenu>
    <DropdownMenuTrigger>View</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuCheckboxItem bind:checked={statusBar}>Status Bar</DropdownMenuCheckboxItem>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup bind:value={position}>
        <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
  <output>Last: {last}; Status bar: {statusBar}; Position: {position}</output>
</div>
