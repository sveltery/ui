<script lang="ts">
  import type { Percent } from '../util/types.js';
  import { useAppDispatch } from '../state/hooks.svelte.js';
  import { setChartSize } from '../state/layoutSlice.js';
  import { isPositiveNumber } from '../util/isWellBehavedNumber.js';
  import { useResponsiveContainerContext } from '../component/ResponsiveContainer.hooks.js';
  import { useIsPanorama } from './PanoramaContext.js';

  let { width: widthFromProps, height: heightFromProps }: { width: number | Percent | undefined; height: number | Percent | undefined } = $props();
  const dispatch = useAppDispatch();
  // A panorama chart leaves the size to the root chart; Brush reads it, so it must stay stable.
  const isPanorama = useIsPanorama();
  const responsiveContainerCalculations = useResponsiveContainerContext();

  // A size from ResponsiveContainer wins over the props, as in recharts 3.x.
  const width = $derived(responsiveContainerCalculations.current.width > 0 ? responsiveContainerCalculations.current.width : widthFromProps);
  const height = $derived(responsiveContainerCalculations.current.height > 0 ? responsiveContainerCalculations.current.height : heightFromProps);

  $effect(() => {
    if (!isPanorama && isPositiveNumber(width) && isPositiveNumber(height)) {
      dispatch(setChartSize({ width, height }));
    }
  });
</script>
