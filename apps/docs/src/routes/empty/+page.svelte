<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { IconLibraryProvider, iconLibraries, type IconLibraryName } from '@sveltery/ui/icons';
  import EmptyExample from '../../../examples/base/EmptyExample.svelte';
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
  const library = $derived(iconLibraries.includes(page.url.searchParams.get('library') as IconLibraryName) ? page.url.searchParams.get('library') as IconLibraryName : 'lucide');
</script>
<main class="p-8" data-hydrated={hydrated}><IconLibraryProvider {library}><EmptyExample /></IconLibraryProvider></main>
