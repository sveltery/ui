<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { TrapezoidViewBox } from '../util/types.js';
  import type { CartesianLabelListEntry } from '../component/LabelList.js';
  import type { AreaPointItem } from '../state/selectors/areaSelectors.js';
  import CartesianLabelListContextProvider from '../component/CartesianLabelListContextProvider.svelte';

  let { showLabels, children, points }: { showLabels: boolean; children?: Snippet; points: ReadonlyArray<AreaPointItem> } = $props();

  const labelListEntries: ReadonlyArray<CartesianLabelListEntry> = $derived(
    points.map((point): CartesianLabelListEntry => {
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
