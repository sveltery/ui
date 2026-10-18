<script lang="ts">
  import RadarChart from '../../../src/chart/RadarChart.svelte';
  import Radar from '../../../src/polar/Radar.svelte';
  import PolarGrid from '../../../src/polar/PolarGrid.svelte';
  import PolarAngleAxis from '../../../src/polar/PolarAngleAxis.svelte';
  import PolarRadiusAxis from '../../../src/polar/PolarRadiusAxis.svelte';
  import Tooltip from '../../../src/component/Tooltip.svelte';

  let {
    data,
    radarProps = {},
    gridProps = {},
    angleAxis = true,
    radiusAxis = false,
    tooltip = false,
  }: { data: Record<string, unknown>[]; radarProps?: Record<string, unknown>; gridProps?: Record<string, unknown>; angleAxis?: boolean; radiusAxis?: boolean; tooltip?: boolean } = $props();
</script>

<RadarChart width={400} height={400} {data}
  >{#if tooltip}<Tooltip />{/if}<PolarGrid {...gridProps} />{#if angleAxis}<PolarAngleAxis dataKey="name" />{/if}{#if radiusAxis}<PolarRadiusAxis angle={60} />{/if}<Radar dataKey="value" fill="red" isAnimationActive={false} {...radarProps} /></RadarChart
>
