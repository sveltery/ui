<script lang="ts">
  import type { LegendType } from '../util/types.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectRadialBarLegendPayload } from '../state/selectors/radialBarSelectors.js';
  import SetPolarLegendPayload from '../state/SetPolarLegendPayload.svelte';

  let { legendType }: { legendType: LegendType | undefined } = $props();
  const legendPayload = useAppSelector((state) => selectRadialBarLegendPayload(state, legendType));
</script>

<SetPolarLegendPayload legendPayload={legendPayload.current ?? []} />
