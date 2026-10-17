<script lang="ts">
  import PencilIcon from '@lucide/svelte/icons/pencil';
  import ShareIcon from '@lucide/svelte/icons/share';
  import TrashIcon from '@lucide/svelte/icons/trash';
  import { Button } from '$registry/bases/base/ui/button';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '$registry/bases/base/ui/dropdown-menu';
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Actions
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <PencilIcon />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem>
        <ShareIcon />
        Share
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem variant="destructive">
        <TrashIcon />
        Delete
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
