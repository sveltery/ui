<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PolarLabelListEntry } from '../component/LabelList.js';
  import PolarLabelListContextProvider from '../component/PolarLabelListContextProvider.svelte';
  import type { RadialBarDataItem } from './RadialBar.js';

  let { showLabels, sectors, children }: { showLabels: boolean; sectors: ReadonlyArray<RadialBarDataItem>; children?: Snippet } = $props();

  const labelListEntries: ReadonlyArray<PolarLabelListEntry> = $derived(
    sectors.map(
      (sector: RadialBarDataItem): PolarLabelListEntry => ({
        value: sector.value,
        payload: sector.payload,
        parentViewBox: undefined,
        clockWise: false,
        viewBox: {
          cx: sector.cx,
          cy: sector.cy,
          innerRadius: sector.innerRadius,
          outerRadius: sector.outerRadius,
          startAngle: sector.startAngle,
          endAngle: sector.endAngle,
          clockWise: false,
        },
        fill: sector.fill,
      }),
    ),
  );
</script>

<PolarLabelListContextProvider value={showLabels ? labelListEntries : undefined}>
  {@render children?.()}
</PolarLabelListContextProvider>
