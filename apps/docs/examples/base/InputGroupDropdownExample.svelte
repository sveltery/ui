<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import MoreHorizontalIcon from '@lucide/svelte/icons/ellipsis';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '$registry/bases/base/ui/dropdown-menu';
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '$registry/bases/base/ui/input-group';
</script>

{#snippet moreButton(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <InputGroupButton {...props} variant="ghost" aria-label="More" size="icon-xs">{@render children?.()}</InputGroupButton>
{/snippet}

{#snippet searchInButton(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <InputGroupButton {...props} variant="ghost" class="pr-1.5! text-xs">{@render children?.()}</InputGroupButton>
{/snippet}

<div class="grid w-full max-w-sm gap-4">
  <InputGroup>
    <InputGroupInput placeholder="Enter file name" />
    <InputGroupAddon align="inline-end">
      <DropdownMenu>
        <DropdownMenuTrigger render={moreButton}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} alignOffset={-4}>
          <DropdownMenuGroup>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Copy path</DropdownMenuItem>
            <DropdownMenuItem>Open location</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </InputGroupAddon>
  </InputGroup>
  <InputGroup>
    <InputGroupInput placeholder="Enter search query" />
    <InputGroupAddon align="inline-end">
      <DropdownMenu>
        <DropdownMenuTrigger render={searchInButton}>
          Search In... <ChevronDownIcon class="size-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} alignOffset={-4}>
          <DropdownMenuGroup>
            <DropdownMenuItem>Documentation</DropdownMenuItem>
            <DropdownMenuItem>Blog Posts</DropdownMenuItem>
            <DropdownMenuItem>Changelog</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </InputGroupAddon>
  </InputGroup>
</div>
