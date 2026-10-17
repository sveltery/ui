<script lang="ts">
  import { setChartData, setComputedData } from '../state/chartDataSlice.js';
  import { useAppDispatch } from '../state/hooks.svelte.js';
  import { toStoreValue } from '../state/toStoreValue.js';

  let { computedData }: { computedData: unknown } = $props();
  const dispatch = useAppDispatch();
  $effect(() => {
    dispatch(setComputedData(toStoreValue(computedData)));
    return () => {
      dispatch(setChartData(undefined));
    };
  });
</script>
