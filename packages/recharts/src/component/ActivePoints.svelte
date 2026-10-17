<svelte:options namespace="svg" />

<script lang="ts">
  import { adaptEventHandlers, type ActiveDotProps } from '../util/types.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectActiveTooltipIndex } from '../state/selectors/tooltipSelectors.js';
  import { useActiveTooltipDataPoints } from '../hooks.svelte.js';
  import { isNullish } from '../util/DataUtils.js';
  import { svgPropertiesNoEventsFromUnknown } from '../util/svgPropertiesNoEvents.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
  import Layer from '../container/Layer.svelte';
  import Dot from '../shape/Dot.svelte';
  import RenderProp from '../util/RenderProp.svelte';
  import type { SvelteProps } from '../util/svelteProps.js';
  import type { Props as DotProps } from '../shape/Dot.js';
  import type { ActivePointsProps, PointType } from './ActivePoints.js';

  let { points, mainColor, activeDot, itemDataKey, clipPath, zIndex = DefaultZIndexes.activeDot }: ActivePointsProps = $props();

  const activeTooltipIndex = useAppSelector(selectActiveTooltipIndex);
  const activeDataPoints = useActiveTooltipDataPoints();

  const activePoint: PointType | undefined = $derived.by(() => {
    const dataPoints = activeDataPoints.current;
    if (points == null || dataPoints == null) {
      return undefined;
    }
    return points.find((p) => dataPoints.includes(p.payload));
  });

  function dotProps(point: PointType, childIndex: number): ActiveDotProps {
    const dotPropsTyped: ActiveDotProps = {
      index: childIndex,
      dataKey: itemDataKey,
      cx: point.x ?? undefined,
      cy: point.y ?? undefined,
      r: 4,
      fill: mainColor ?? 'none',
      strokeWidth: 2,
      stroke: '#fff',
      payload: point.payload,
      value: point.value,
    };
    return {
      ...dotPropsTyped,
      ...svgPropertiesNoEventsFromUnknown(activeDot),
      ...adaptEventHandlers(activeDot),
    } as ActiveDotProps;
  }
</script>

{#snippet ActivePoint(point: PointType, childIndex: number)}
  {#if !(activeDot === false || point.x == null || point.y == null)}
    <Layer class="recharts-active-dot" {clipPath}>
      {#if typeof activeDot === 'function'}
        <RenderProp of={activeDot as never} props={dotProps(point, childIndex)} />
      {:else}
        <Dot {...dotProps(point, childIndex) as SvelteProps<DotProps>} />
      {/if}
    </Layer>
  {/if}
{/snippet}

{#if !isNullish(activePoint)}
  <ZIndexLayer {zIndex}>
    {@render ActivePoint(activePoint, Number(activeTooltipIndex.current))}
  </ZIndexLayer>
{/if}
