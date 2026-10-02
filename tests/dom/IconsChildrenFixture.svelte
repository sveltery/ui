<script lang="ts">
  import type { IconLibraryName } from '../../apps/docs/registry/bases/base/ui/icons/config.js';
  import IconLibraryProvider from '../../apps/docs/registry/bases/base/ui/icons/IconLibraryProvider.svelte';
  import IconPlaceholder from '../../apps/docs/registry/bases/base/ui/icons/IconPlaceholder.svelte';
  let { library }: { library: IconLibraryName } = $props();
</script>
<IconLibraryProvider {library}>
  <IconPlaceholder lucide="ArrowLeftIcon" tabler="IconArrowLeft" hugeicons="ArrowLeft01Icon" phosphor="ArrowLeftIcon" remixicon="RiArrowLeftLine" title="Native title">
    <text data-child>Provided &amp; child</text>
  </IconPlaceholder>
</IconLibraryProvider>
