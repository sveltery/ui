<script lang="ts">
  import { setChartData, type ChartData } from '../state/chartDataSlice.js';
  import { useAppDispatch } from '../state/hooks.svelte.js';
  import { toStoreValue } from '../state/toStoreValue.js';
  import { useIsPanorama } from './PanoramaContext.js';

  let { chartData }: { chartData: ChartData | undefined } = $props();
  const dispatch = useAppDispatch();
  const isPanorama = useIsPanorama();
  $effect(() => {
    // A panorama chart reuses the main chart's data, so it must not overwrite it.
    if (isPanorama) return;
    dispatch(setChartData(toStoreValue(chartData)));
    return () => {
      dispatch(setChartData(undefined));
    };
  });
</script>
