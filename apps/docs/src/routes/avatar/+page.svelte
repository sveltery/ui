<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { IconLibraryProvider, iconLibraries } from '@sveltery/ui/icons';
  import AvatarExample from '../../../examples/base/AvatarExample.svelte';
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
  // Authored harness supplies the existing provider's resolved library value only.
  const library = $derived(iconLibraries.find(value => value === page.url.searchParams.get('library')) ?? 'lucide');
</script>
<main class="p-8" data-hydrated={hydrated}><IconLibraryProvider {library}><AvatarExample /></IconLibraryProvider></main>
