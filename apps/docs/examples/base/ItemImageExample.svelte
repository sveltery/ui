<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '$registry/bases/base/ui/item';

  const music = [
    { title: 'Midnight City Lights', artist: 'Neon Dreams', album: 'Electric Nights', duration: '3:45' },
    { title: 'Coffee Shop Conversations', artist: 'The Morning Brew', album: 'Urban Stories', duration: '4:05' },
    { title: 'Digital Rain', artist: 'Cyber Symphony', album: 'Binary Beats', duration: '3:30' }
  ];
</script>

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

<div class="flex w-full max-w-md flex-col gap-6">
  <ItemGroup class="gap-4">
    {#each music as song (song.title)}
      <Item variant="outline" render={link} role="listitem">
        <ItemMedia variant="image">
          <img src="https://avatar.vercel.sh/{song.title}" alt={song.title} width="32" height="32" class="object-cover grayscale" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle class="line-clamp-1">
            {song.title} -
            <span class="text-muted-foreground">{song.album}</span>
          </ItemTitle>
          <ItemDescription>{song.artist}</ItemDescription>
        </ItemContent>
        <ItemContent class="flex-none text-center">
          <ItemDescription>{song.duration}</ItemDescription>
        </ItemContent>
      </Item>
    {/each}
  </ItemGroup>
</div>
