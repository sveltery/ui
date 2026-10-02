<script lang="ts">
  import { onMount } from 'svelte';
  import { IconLibraryProvider, IconPlaceholder, type IconLibraryName } from '../../registry/bases/base/ui/icons/index.js';
  let library = $state<IconLibraryName>('lucide');
  const original = { lucide: 'ArrowLeftIcon', tabler: 'IconArrowLeft', hugeicons: 'ArrowLeft01Icon', phosphor: 'ArrowLeftIcon', remixicon: 'RiArrowLeftLine' };
  let names = $state({ ...original });
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
  export function select(next: IconLibraryName) { library = next; }
  export function unknown() { names = Object.fromEntries(Object.keys(original).map(key => [key, 'UnknownExport'])) as typeof names; }
  export function absent() { names = Object.fromEntries(Object.keys(original).map(key => [key, ''])) as typeof names; }
  export function restore() { names = { ...original }; }
  export function changeName() { names.lucide = 'ArrowRightIcon'; }
</script>
<div data-icons-hydrated={hydrated}>
  <IconLibraryProvider {library}><IconPlaceholder {...names} data-testid="selected-icon" strokeWidth={7} /></IconLibraryProvider>
  <div>
    {#each ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as next (next)}<button onclick={() => select(next as IconLibraryName)}>{next}</button>{/each}
    <button onclick={unknown}>Unknown</button><button onclick={absent}>Absent</button><button onclick={restore}>Restore</button><button onclick={changeName}>Change name</button>
  </div>
</div>
