<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { iconLibraries, type IconLibraryName } from '@sveltery/ui/icons';
  import ButtonGalleryFixture from '../../../examples/base/ButtonGalleryFixture.svelte';
  let hydrated = $state(false);
  const library = $derived(iconLibraries.includes(page.url.searchParams.get('library') as IconLibraryName) ? page.url.searchParams.get('library') as IconLibraryName : 'lucide');
  onMount(() => { hydrated = true; });
</script>
<main class="p-8" data-hydrated={hydrated}><ButtonGalleryFixture {library} /></main>
