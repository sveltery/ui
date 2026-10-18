<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { TrapezoidViewBox } from '../util/types.js';
  import type { CartesianLabelListEntry } from '../component/LabelList.js';
  import CartesianLabelListContextProvider from '../component/CartesianLabelListContextProvider.svelte';
  import type { RadarPoint } from './Radar.js';

  let { showLabels, points, children }: { showLabels: boolean; points: ReadonlyArray<RadarPoint>; children?: Snippet } = $props();

  // Upstream labels each point with a zero-size Cartesian box at the point, not with a polar view box.
  const labelListEntries: ReadonlyArray<CartesianLabelListEntry> = $derived(
    points.map((point): CartesianLabelListEntry => {
      const viewBox: TrapezoidViewBox = {
        x: point.x,
        y: point.y,
        width: 0,
        lowerWidth: 0,
        upperWidth: 0,
        height: 0,
      };
      return {
        ...viewBox,
        value: point.value ?? '',
        payload: point.payload,
        parentViewBox: undefined,
        viewBox,
        fill: undefined,
      };
    }),
  );
</script>

<CartesianLabelListContextProvider value={showLabels ? labelListEntries : undefined}>
  {@render children?.()}
</CartesianLabelListContextProvider>
