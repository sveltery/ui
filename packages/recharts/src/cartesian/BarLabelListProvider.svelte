<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { TrapezoidViewBox } from '../util/types.js';
  import type { CartesianLabelListEntry } from '../component/LabelList.js';
  import CartesianLabelListContextProvider from '../component/CartesianLabelListContextProvider.svelte';
  import type { BarRectangleItem } from './Bar.js';

  let { showLabels, children, rects }: { showLabels: boolean; children?: Snippet; rects: ReadonlyArray<BarRectangleItem> | undefined } = $props();

  const labelListEntries: ReadonlyArray<CartesianLabelListEntry> | undefined = $derived(
    rects?.map((entry: BarRectangleItem): CartesianLabelListEntry => {
      const viewBox: TrapezoidViewBox = {
        x: entry.x,
        y: entry.y,
        width: entry.width,
        lowerWidth: entry.width,
        upperWidth: entry.width,
        height: entry.height,
      };
      return {
        ...viewBox,
        value: entry.value,
        payload: entry.payload,
        parentViewBox: entry.parentViewBox,
        viewBox,
        fill: entry.fill,
      };
    }),
  );
</script>

<CartesianLabelListContextProvider value={showLabels ? labelListEntries : undefined}>
  {@render children?.()}
</CartesianLabelListContextProvider>
