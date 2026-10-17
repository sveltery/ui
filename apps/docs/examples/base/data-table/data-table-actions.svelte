<script lang="ts">
  import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
  import { Button } from '$registry/bases/base/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';

  let { id }: { id: string } = $props();
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet render(props, _state, children)}
      <Button {...props} variant="ghost" class="h-8 w-8 p-0">{@render children?.()}</Button>
    {/snippet}
    <span class="sr-only">Open menu</span>
    <EllipsisIcon class="h-4 w-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onclick={() => navigator.clipboard.writeText(id)}>Copy payment ID</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem>View customer</DropdownMenuItem>
    <DropdownMenuItem>View payment details</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
