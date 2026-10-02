<script lang="ts">
  import type { Snippet } from 'svelte';
  import { setIconLibraryContext, type IconLibraryName } from './config.js';
  let { library = 'lucide', children }: { library?: IconLibraryName; children?: Snippet } = $props();
  setIconLibraryContext(() => library);
</script>
{@render children?.()}
