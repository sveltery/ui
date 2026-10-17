<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { useChartLayout } from '../context/chartLayoutContext.svelte.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectBarRectangles } from '../state/selectors/barSelectors.js';
  import { provideCellReader } from '../component/Cell.hooks.svelte.js';
  import SetErrorBarContext from '../context/SetErrorBarContext.svelte';
  import { useNeedsClip } from './GraphicalItemClipPath.hooks.js';
  import { errorBarDataPointFormatter, type BarImplProps, type BarRectangleItem, type InternalProps } from './Bar.js';
  import BarWithState from './BarWithState.svelte';

  let props: BarImplProps = $props();

  const clip = useNeedsClip(
    () => props.xAxisId,
    () => props.yAxisId,
  );
  const layout = useChartLayout();
  const isPanorama = useIsPanorama();
  // Upstream finds the Cell elements among its children. Cells rendered in this Bar's children register here instead.
  const cells = provideCellReader();

  const rects = useAppSelector((state): ReadonlyArray<BarRectangleItem> | undefined => selectBarRectangles(state, props.id, isPanorama, cells.current));

  const errorBarOffset = $derived.by(() => {
    const firstDataPoint = rects.current?.[0];
    if (firstDataPoint == null || firstDataPoint.height == null || firstDataPoint.width == null) {
      return 0;
    }
    return layout.current === 'vertical' ? firstDataPoint.height / 2 : firstDataPoint.width / 2;
  });

  const withState = $derived({ ...props, layout: layout.current, needClip: clip.current.needClip, data: rects.current } as unknown as InternalProps & { children?: Snippet });
</script>

{#if layout.current === 'vertical' || layout.current === 'horizontal'}
  <SetErrorBarContext xAxisId={props.xAxisId} yAxisId={props.yAxisId} data={rects.current} dataPointFormatter={errorBarDataPointFormatter} {errorBarOffset}>
    <BarWithState {...withState} />
  </SetErrorBarContext>
{/if}
