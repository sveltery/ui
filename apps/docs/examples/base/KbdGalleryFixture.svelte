<!-- SSR diagnostic provider outside the genuine gallery; not a new source component. -->
<script lang="ts">
  import { IconLibraryProvider, type IconLibraryName } from '@sveltery/ui/icons';
  import Gallery from './KbdExample.svelte';
  let { library = 'lucide' }: { library?: IconLibraryName } = $props();
</script>
<IconLibraryProvider {library}><Gallery /></IconLibraryProvider>
