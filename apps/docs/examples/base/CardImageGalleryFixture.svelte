<script lang="ts">
  // External library input only; genuine bodies carry no harness props.
  import { IconLibraryProvider, type IconLibraryName } from '@sveltery/ui/icons';
  import CardImageExample from './CardImageExample.svelte';
  let { library = 'lucide' }: { library?: IconLibraryName } = $props();
</script>
<IconLibraryProvider {library}><CardImageExample /></IconLibraryProvider>
