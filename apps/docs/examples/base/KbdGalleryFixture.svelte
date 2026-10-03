<!-- SSR diagnostic provider outside the genuine gallery; not a new source component. -->
<script lang="ts">
  import { IconLibraryProvider, type IconLibraryName } from '@sveltery/ui/icons';
  import { Kbd } from '@sveltery/ui/kbd';
  import Gallery from './KbdExample.svelte';
  let { library = 'lucide' }: { library?: IconLibraryName } = $props();
</script>
<IconLibraryProvider {library}><div data-gallery=""><Gallery /><Kbd data-testid="override" class="h-8 min-w-8 rounded-none px-3 text-sm">Alt</Kbd></div></IconLibraryProvider>
