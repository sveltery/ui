<script lang="ts">
  import type { TickItem } from '../util/types.js';
  import type { AxisId } from '../state/cartesianAxisSlice.js';
  import { useAppDispatch } from '../state/hooks.svelte.js';
  import { removeRenderedTicks, setRenderedTicks } from '../state/renderedTicksSlice.js';

  let { ticks, axisType, axisId }: { ticks: ReadonlyArray<TickItem>; axisType: 'xAxis' | 'yAxis' | undefined; axisId: AxisId | undefined } = $props();
  const dispatch = useAppDispatch();

  $effect(() => {
    if (axisId == null || axisType == null) {
      return;
    }
    const registered = { axisId, axisType };
    // Only the public fields are exposed; the rest are internal.
    const tickItems = ticks.map((tick) => ({ value: tick.value, coordinate: tick.coordinate, offset: tick.offset, index: tick.index }));
    dispatch(setRenderedTicks({ ticks: tickItems, ...registered }));
    return () => {
      dispatch(removeRenderedTicks(registered));
    };
  });
</script>
