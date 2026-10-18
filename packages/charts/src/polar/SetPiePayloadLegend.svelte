<script lang="ts">
  import type { CellEntry } from '../component/Cell.hooks.svelte.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectPieLegend } from '../state/selectors/pieSelectors.js';
  import SetPolarLegendPayload from '../state/SetPolarLegendPayload.svelte';

  let { id, cells }: { id: string; cells: ReadonlyArray<CellEntry> } = $props();
  const legendPayload = useAppSelector((state) => selectPieLegend(state, id, cells));
</script>

{#if legendPayload.current != null}
  <SetPolarLegendPayload legendPayload={legendPayload.current} />
{/if}
