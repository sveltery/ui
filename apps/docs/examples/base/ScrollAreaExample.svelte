<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { ScrollArea, ScrollBar } from '$registry/bases/base/ui/scroll-area';
  import { Separator } from '$registry/bases/base/ui/separator';

  const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

  const works = [
    {
      artist: 'Ornella Binni',
      art: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
    },
    {
      artist: 'Tom Byrom',
      art: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
    },
    {
      artist: 'Vladimir Malyav',
      art: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
    },
  ];
</script>

{#snippet ScrollAreaVertical()}
  <Example title="Vertical">
    <ScrollArea class="mx-auto h-72 w-48 rounded-md border style-luma:rounded-2xl style-rhea:rounded-2xl">
      <div class="p-4">
        <h4 class="mb-4 text-sm leading-none font-medium">Tags</h4>
        {#each tags as tag (tag)}
          <div class="text-sm">{tag}</div>
          <Separator class="my-2" />
        {/each}
      </div>
    </ScrollArea>
  </Example>
{/snippet}

{#snippet ScrollAreaHorizontal()}
  <Example title="Horizontal">
    <ScrollArea class="mx-auto w-full max-w-96 rounded-md border p-4 style-luma:rounded-2xl style-rhea:rounded-2xl">
      <div class="flex gap-4">
        {#each works as artwork (artwork.artist)}
          <figure class="shrink-0">
            <div class="overflow-hidden rounded-md">
              <img
                src={artwork.art}
                alt="Photo by {artwork.artist}"
                class="aspect-[3/4] h-fit w-fit object-cover"
                width="300"
                height="400"
              />
            </div>
            <figcaption class="pt-2 text-xs text-muted-foreground">
              Photo by <span class="font-semibold text-foreground">{artwork.artist}</span>
            </figcaption>
          </figure>
        {/each}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render ScrollAreaVertical()}
  {@render ScrollAreaHorizontal()}
</ExampleWrapper>
