<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PolarLabelListEntry } from '../component/LabelList.js';
  import PolarLabelListContextProvider from '../component/PolarLabelListContextProvider.svelte';
  import type { PieSectorDataItem } from './Pie.js';

  let { showLabels, sectors, children }: { showLabels: boolean; sectors: ReadonlyArray<PieSectorDataItem>; children?: Snippet } = $props();

  const labelListEntries: ReadonlyArray<PolarLabelListEntry> = $derived.by(() => {
    if (!showLabels || !sectors) {
      return [];
    }
    return sectors.map(
      (entry): PolarLabelListEntry => ({
        value: entry.value,
        payload: entry.payload,
        clockWise: false,
        parentViewBox: undefined,
        viewBox: {
          cx: entry.cx,
          cy: entry.cy,
          innerRadius: entry.innerRadius,
          outerRadius: entry.outerRadius,
          startAngle: entry.startAngle,
          endAngle: entry.endAngle,
          clockWise: false,
        },
        fill: entry.fill,
      }),
    );
  });
</script>

<PolarLabelListContextProvider value={showLabels ? labelListEntries : undefined}>
  {@render children?.()}
</PolarLabelListContextProvider>
