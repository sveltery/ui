<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { TrapezoidViewBox } from '../util/types.js';
  import type { CartesianLabelListEntry } from '../component/LabelList.js';
  import CartesianLabelListContextProvider from '../component/CartesianLabelListContextProvider.svelte';
  import type { LinePointItem } from './Line.js';

  let { showLabels, children, points }: { showLabels: boolean; children?: Snippet; points: ReadonlyArray<LinePointItem> } = $props();

  const labelListEntries: ReadonlyArray<CartesianLabelListEntry> = $derived(
    points?.map((point): CartesianLabelListEntry => {
      const viewBox: TrapezoidViewBox = {
        x: point.x ?? 0,
        y: point.y ?? 0,
        width: 0,
        lowerWidth: 0,
        upperWidth: 0,
        height: 0,
      };
      return {
        ...viewBox,
        value: point.value,
        payload: point.payload,
        viewBox,
        // Line is not passing parentViewBox to the LabelList so the labels can escape - looks like a bug, should we pass parentViewBox?
        // Or should this just be the root chart viewBox?
        parentViewBox: undefined,
        fill: undefined,
      };
    }),
  );
</script>

<CartesianLabelListContextProvider value={showLabels ? labelListEntries : undefined}>
  {@render children?.()}
</CartesianLabelListContextProvider>
