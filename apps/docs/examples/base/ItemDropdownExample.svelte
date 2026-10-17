<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import { Avatar, AvatarFallback, AvatarImage } from '$registry/bases/base/ui/avatar';
  import { Button } from '$registry/bases/base/ui/button';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '$registry/bases/base/ui/dropdown-menu';
  import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '$registry/bases/base/ui/item';

  const people = [
    { username: 'shadcn', avatar: 'https://github.com/shadcn.png', email: 'shadcn@vercel.com' },
    { username: 'maxleiter', avatar: 'https://github.com/maxleiter.png', email: 'maxleiter@vercel.com' },
    { username: 'evilrabbit', avatar: 'https://github.com/evilrabbit.png', email: 'evilrabbit@vercel.com' }
  ];
</script>

{#snippet outlineButton(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <Button variant="outline" {...props}>{@render children?.()}</Button>
{/snippet}

<DropdownMenu>
  <DropdownMenuTrigger render={outlineButton}>
    Select <ChevronDownIcon />
  </DropdownMenuTrigger>
  <DropdownMenuContent class="w-48" align="end">
    <DropdownMenuGroup>
      {#each people as person (person.username)}
        <DropdownMenuItem>
          <Item size="xs" class="w-full p-2">
            <ItemMedia>
              <Avatar class="size-[--spacing(6.5)]">
                <AvatarImage src={person.avatar} class="grayscale" />
                <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent class="gap-0">
              <ItemTitle>{person.username}</ItemTitle>
              <ItemDescription class="leading-none">{person.email}</ItemDescription>
            </ItemContent>
          </Item>
        </DropdownMenuItem>
      {/each}
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
