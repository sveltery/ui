<script lang="ts">
  import AlertTriangleIcon from '@lucide/svelte/icons/triangle-alert';
  import CheckIcon from '@lucide/svelte/icons/check';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import CopyIcon from '@lucide/svelte/icons/copy';
  import ShareIcon from '@lucide/svelte/icons/share';
  import TrashIcon from '@lucide/svelte/icons/trash';
  import UserRoundXIcon from '@lucide/svelte/icons/user-round-x';
  import VolumeOffIcon from '@lucide/svelte/icons/volume-off';
  import { Button } from '$registry/bases/base/ui/button';
  import { ButtonGroup } from '$registry/bases/base/ui/button-group';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '$registry/bases/base/ui/dropdown-menu';
</script>

<ButtonGroup>
  <Button variant="outline">Follow</Button>
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet render(props, _state, content)}
        <Button variant="outline" class="pl-2!" {...props}>{@render content?.()}</Button>
      {/snippet}
      <ChevronDownIcon />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-44">
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <VolumeOffIcon />
          Mute Conversation
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CheckIcon />
          Mark as Read
        </DropdownMenuItem>
        <DropdownMenuItem>
          <AlertTriangleIcon />
          Report Conversation
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserRoundXIcon />
          Block User
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShareIcon />
          Share Conversation
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon />
          Copy Conversation
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem variant="destructive">
          <TrashIcon />
          Delete Conversation
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</ButtonGroup>
