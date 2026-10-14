<script lang="ts">
  import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue } from '@sveltery/ui/combobox';

  const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'] as const;

  let anchor = $state<HTMLElement | null>(null);
</script>

<Combobox multiple autoHighlight items={frameworks} defaultValue={[frameworks[0]]}>
  <ComboboxChips bind:ref={anchor} class="w-full max-w-xs">
    <ComboboxValue>
      {#snippet children(values)}
        {const selected = $derived(values as string[])}
        {#each selected as value (value)}
          <ComboboxChip>{value}</ComboboxChip>
        {/each}
        <ComboboxChipsInput />
      {/snippet}
    </ComboboxValue>
  </ComboboxChips>
  <ComboboxContent {anchor}>
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
