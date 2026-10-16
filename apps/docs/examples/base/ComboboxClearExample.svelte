<script lang="ts">
  import { Combobox, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@sveltery/components/combobox';

  const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'] as const;
</script>

<Combobox items={frameworks} defaultValue={frameworks[0]}>
  <ComboboxInput placeholder="Select a framework" showClear />
  <ComboboxContent>
    <ComboboxEmpty>No items found.</ComboboxEmpty>
    <ComboboxList>
      <ComboboxCollection>
        {#snippet children(item: string)}
          <ComboboxItem value={item}>{item}</ComboboxItem>
        {/snippet}
      </ComboboxCollection>
    </ComboboxList>
  </ComboboxContent>
</Combobox>
