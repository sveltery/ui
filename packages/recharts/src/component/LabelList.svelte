<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { getValueByDataKey } from '../util/ChartUtils.js';
  import { isNullish } from '../util/DataUtils.js';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { rechartsProps } from '../util/svelteProps.js';
  import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import Layer from '../container/Layer.svelte';
  import { defaultAccessor, type CartesianLabelListEntry, type PolarLabelListEntry, type Props } from './LabelList.js';
  import { useCartesianLabelListContext, usePolarLabelListContext, type LabelListProps } from './LabelList.hooks.svelte.js';
  import Label from './Label.svelte';
  import type { LabelProps } from './Label.hooks.svelte.js';

  let raw: LabelListProps = $props();
  const restProps = rechartsProps<Props, object>(() => raw as Props, {});

  const cartesianData = useCartesianLabelListContext();
  const polarData = usePolarLabelListContext();
  const data: ReadonlyArray<CartesianLabelListEntry | PolarLabelListEntry> | undefined = $derived(cartesianData.current || polarData.current);

  const labels = $derived.by(() => {
    const { valueAccessor = defaultAccessor, dataKey, id, textBreakAll, ...others } = omit(restProps, ['clockWise', 'zIndex']);
    return (data ?? []).map((entry, index) => {
      const value = isNullish(dataKey) ? valueAccessor(entry, index) : (getValueByDataKey(entry.payload, dataKey) as string | number);
      const idProps = isNullish(id) ? {} : { id: `${id}-${index}` };
      return {
        ...svgPropertiesAndEvents(entry),
        ...others,
        ...idProps,
        // An explicit fill on LabelList wins over the entry's fill, which is hard to read inside filled shapes.
        fill: restProps.fill ?? entry.fill,
        parentViewBox: entry.parentViewBox,
        value,
        textBreakAll,
        viewBox: entry.viewBox,
        index,
        // The labels inherit LabelList's layer instead of portalling to Label's default one.
        zIndex: 0,
      };
    });
  });
</script>

{#if data && data.length}
  <ZIndexLayer zIndex={restProps.zIndex ?? DefaultZIndexes.label}>
    <Layer class="recharts-label-list">
      {#each labels as label, index (index)}
        <Label {...label as LabelProps} />
      {/each}
    </Layer>
  </ZIndexLayer>
{/if}
