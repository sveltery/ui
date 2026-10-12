<script lang="ts">
  import { IconLibraryProvider, IconPlaceholder, type IconLibraryName } from '$ui/icons/index.js';
  let { library = undefined, ...props }: { library?: IconLibraryName } & Record<string, unknown> = $props();
</script>
{#snippet icon()}
  <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" {...props} />
{/snippet}
{#if library}
  <IconLibraryProvider {library}>{@render icon()}</IconLibraryProvider>
{:else}
  {@render icon()}
{/if}
