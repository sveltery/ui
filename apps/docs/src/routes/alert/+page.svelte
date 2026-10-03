<script lang="ts">
  import { page } from '$app/state';
  import { IconLibraryProvider, iconLibraries, type IconLibraryName } from '@sveltery/ui/icons';
  import AlertExample from '../../../examples/base/AlertExample.svelte';
  const library = $derived(iconLibraries.includes(page.url.searchParams.get('library') as IconLibraryName) ? page.url.searchParams.get('library') as IconLibraryName : 'lucide');
</script>
<main class="p-8"><IconLibraryProvider {library}><AlertExample /></IconLibraryProvider></main>
