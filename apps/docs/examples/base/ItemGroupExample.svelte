<script lang="ts">
  import PlusIcon from '@lucide/svelte/icons/plus';
  import { Avatar, AvatarFallback, AvatarImage } from '$registry/bases/base/ui/avatar';
  import { Button } from '$registry/bases/base/ui/button';
  import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '$registry/bases/base/ui/item';

  const people = [
    { username: 'shadcn', avatar: 'https://github.com/shadcn.png', email: 'shadcn@vercel.com' },
    { username: 'maxleiter', avatar: 'https://github.com/maxleiter.png', email: 'maxleiter@vercel.com' },
    { username: 'evilrabbit', avatar: 'https://github.com/evilrabbit.png', email: 'evilrabbit@vercel.com' }
  ];
</script>

<ItemGroup class="max-w-sm">
  {#each people as person (person.username)}
    <Item variant="outline">
      <ItemMedia>
        <Avatar>
          <AvatarImage src={person.avatar} class="grayscale" />
          <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent class="gap-1">
        <ItemTitle>{person.username}</ItemTitle>
        <ItemDescription>{person.email}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="icon" class="rounded-full" aria-label="Add {person.username}">
          <PlusIcon />
        </Button>
      </ItemActions>
    </Item>
  {/each}
</ItemGroup>
