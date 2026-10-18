<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -- upstream's default, so untyped data stays untyped -->
<script lang="ts" generics="DataPointType = any">
  import { arrayTooltipSearcher } from '../state/optionsSlice.js';
  import { defaultPieChartProps } from './PieChart.js';
  import type { PolarChartProps, TooltipEventType } from '../util/types.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import PolarChart from './PolarChart.svelte';

  let { ref = $bindable(null), ...props }: SvelteProps<PolarChartProps<DataPointType>> & { ref?: SVGSVGElement | null } = $props();
  const allowedTooltipTypes: ReadonlyArray<TooltipEventType> = ['item'];
  const propsWithDefaults = rechartsProps<PolarChartProps<DataPointType>, typeof defaultPieChartProps>(() => props, defaultPieChartProps);
</script>

<PolarChart
  chartName="PieChart"
  defaultTooltipEventType="item"
  validateTooltipEventTypes={allowedTooltipTypes}
  tooltipPayloadSearcher={arrayTooltipSearcher}
  categoricalChartProps={propsWithDefaults}
  bind:ref
/>
