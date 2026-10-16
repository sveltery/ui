<script lang="ts">
  import { Card, CardContent } from '$registry/bases/base/ui/card';
  import { Item, ItemActions, ItemGroup, ItemHeader, ItemSeparator, ItemTitle } from '$registry/bases/base/ui/item';
  import { Kbd } from '$registry/bases/base/ui/kbd';

  const shortcuts = [
    { label: 'Search', keys: ['⌘', 'K'] },
    { label: 'Quick Actions', keys: ['⌘', 'J'] },
    { label: 'New File', keys: ['⌘', 'N'] },
    { label: 'Save', keys: ['⌘', 'S'] },
    { label: 'Toggle Sidebar', keys: ['⌘', 'B'] }
  ] as const;
</script>

<Card>
  <CardContent>
    <div class="flex flex-col gap-3">
      <div class="text-sm font-medium">Shortcuts</div>
      <ItemGroup class="gap-2 text-muted-foreground" data-size="xs">
        {#each shortcuts as { label, keys }, i (label)}
          {#if i > 0}
            <ItemSeparator />
          {/if}
          <Item variant="default" size="xs" class="border-0 px-0 py-0">
            <ItemHeader>
              <ItemTitle class="font-normal">{label}</ItemTitle>
              <ItemActions>
                <div class="flex gap-1">
                  {#each keys as key (key)}
                    <Kbd>{key}</Kbd>
                  {/each}
                </div>
              </ItemActions>
            </ItemHeader>
          </Item>
        {/each}
      </ItemGroup>
    </div>
  </CardContent>
</Card>
