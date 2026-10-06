<script lang="ts">
  // External library input only; canonical bodies carry no harness props.
  import { IconLibraryProvider } from '@sveltery/ui/icons';
  import type { IconLibraryName } from '@sveltery/ui/icons';
  import ButtonExample from './ButtonExample.svelte';
  let { library = 'lucide' }: { library?: IconLibraryName } = $props();
</script>
<IconLibraryProvider {library}><ButtonExample /></IconLibraryProvider>
