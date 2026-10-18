<script lang="ts">
  import type { Snippet } from 'svelte';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectAllRegisteredZIndexes } from './zIndexSelectors.js';
  import ZIndexSvgPortal from './ZIndexSvgPortal.svelte';

  let { children, isPanorama }: { children?: Snippet; isPanorama: boolean } = $props();
  const allRegisteredZIndexes = useAppSelector(selectAllRegisteredZIndexes);
  const allNegativeZIndexes = $derived(allRegisteredZIndexes.current?.filter((zIndex) => zIndex < 0) ?? []);
  // Zero is the default layer and needs no portal.
  const allPositiveZIndexes = $derived(allRegisteredZIndexes.current?.filter((zIndex) => zIndex > 0) ?? []);
</script>

{#each allNegativeZIndexes as zIndex (zIndex)}
  <ZIndexSvgPortal {zIndex} {isPanorama} />
{/each}{@render children?.()}{#each allPositiveZIndexes as zIndex (zIndex)}
  <ZIndexSvgPortal {zIndex} {isPanorama} />
{/each}
