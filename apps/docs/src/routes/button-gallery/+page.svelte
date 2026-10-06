<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import type { IconLibraryName } from '@sveltery/ui/icons';
  import ButtonGalleryFixture from '../../../examples/base/ButtonGalleryFixture.svelte';
  let hydrated = $state(false);
  const library = $derived((page.url.searchParams.get('library') ?? 'lucide') as IconLibraryName);
  onMount(() => { hydrated = true; });
</script>
<main class="p-8" data-hydrated={hydrated}><ButtonGalleryFixture {library} /></main>
