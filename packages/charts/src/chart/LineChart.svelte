<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -- upstream's default, so untyped data stays untyped -->
<script lang="ts" generics="DataPointType = any">
  import { arrayTooltipSearcher } from '../state/optionsSlice.js';
  import type { CartesianChartProps, TooltipEventType } from '../util/types.js';
  import type { SvelteProps } from '../util/svelteProps.js';
  import CartesianChart from './CartesianChart.svelte';

  let { ref = $bindable(null), ...props }: SvelteProps<CartesianChartProps<DataPointType>> & { ref?: SVGSVGElement | null } = $props();
  const allowedTooltipTypes: ReadonlyArray<TooltipEventType> = ['axis'];
</script>

<CartesianChart
  chartName="LineChart"
  defaultTooltipEventType="axis"
  validateTooltipEventTypes={allowedTooltipTypes}
  tooltipPayloadSearcher={arrayTooltipSearcher}
  categoricalChartProps={props}
  bind:ref
/>
