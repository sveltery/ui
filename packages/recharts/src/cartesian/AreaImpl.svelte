<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { RechartsBag } from '../util/svelteProps.js';
  import { usePlotArea } from '../hooks.svelte.js';
  import { useChartLayout } from '../context/chartLayoutContext.svelte.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectArea } from '../state/selectors/areaSelectors.js';
  import { useChartName } from '../state/selectors/selectors.hooks.js';
  import { useNeedsClip } from './GraphicalItemClipPath.hooks.js';
  import type { InternalProps, PropsWithDefaults } from './Area.js';
  import AreaWithState from './AreaWithState.svelte';

  let props: RechartsBag<PropsWithDefaults<unknown, unknown>> = $props();

  const layout = useChartLayout();
  const chartName = useChartName();
  const clip = useNeedsClip(
    () => props.xAxisId,
    () => props.yAxisId,
  );
  const isPanorama = useIsPanorama();

  const area = useAppSelector((state) => selectArea(state, props.id, isPanorama));
  const plotArea = usePlotArea();

  const withState = $derived.by(() => {
    const currentLayout = layout.current;
    if ((currentLayout !== 'horizontal' && currentLayout !== 'vertical') || plotArea.current == null) {
      // Can't render Area in an unsupported layout
      return null;
    }

    if (chartName.current !== 'AreaChart' && chartName.current !== 'ComposedChart') {
      // There is nothing stopping us from rendering Area in other charts, except for historical reasons. Do we want to allow that?
      return null;
    }

    const { height, width, x: left, y: top } = plotArea.current;
    const { points, isRange, baseLine } = area.current ?? {};

    if (!points || !points.length) {
      return null;
    }

    return {
      ...props,
      baseLine,
      height,
      layout: currentLayout,
      isRange,
      needClip: clip.current.needClip,
      points,
      width,
      left,
      top,
    } as unknown as InternalProps & { children?: Snippet };
  });
</script>

{#if withState}
  <AreaWithState {...withState} />
{/if}
