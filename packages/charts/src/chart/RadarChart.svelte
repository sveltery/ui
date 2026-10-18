<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -- upstream's default, so untyped data stays untyped -->
<script lang="ts" generics="DataPointType = any">
  import { arrayTooltipSearcher } from '../state/optionsSlice.js';
  import { defaultRadarChartProps, type RadarChartProps } from './RadarChart.js';
  import type { TooltipEventType } from '../util/types.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import PolarChart from './PolarChart.svelte';

  let { ref = $bindable(null), ...props }: SvelteProps<RadarChartProps<DataPointType>> & { ref?: SVGSVGElement | null } = $props();
  const allowedTooltipTypes: ReadonlyArray<TooltipEventType> = ['axis'];
  const propsWithDefaults = rechartsProps<RadarChartProps<DataPointType>, typeof defaultRadarChartProps>(() => props, defaultRadarChartProps);
</script>

<PolarChart
  chartName="RadarChart"
  defaultTooltipEventType="axis"
  validateTooltipEventTypes={allowedTooltipTypes}
  tooltipPayloadSearcher={arrayTooltipSearcher}
  categoricalChartProps={propsWithDefaults}
  bind:ref
/>
