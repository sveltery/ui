<script lang="ts">
  import type { IconLibraryProviderProps } from './types.js';
  import { setIconLibraryContext } from './config.js';
  let { library = 'lucide', children }: IconLibraryProviderProps = $props();
  setIconLibraryContext(() => library);
</script>
{@render children?.()}
