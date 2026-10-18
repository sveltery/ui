<script lang="ts">
  import RadialBarChart from '../../../src/chart/RadialBarChart.svelte';
  import RadialBar from '../../../src/polar/RadialBar.svelte';
  import PolarRadiusAxis from '../../../src/polar/PolarRadiusAxis.svelte';
  import Cell from '../../../src/component/Cell.svelte';
  import LabelList from '../../../src/component/LabelList.svelte';
  import Tooltip from '../../../src/component/Tooltip.svelte';

  let {
    data,
    barProps = {},
    chartProps = {},
    cells = false,
    labelList = false,
    tooltip = false,
  }: { data: Record<string, unknown>[]; barProps?: Record<string, unknown>; chartProps?: Record<string, unknown>; cells?: boolean; labelList?: boolean; tooltip?: boolean } = $props();
</script>

<RadialBarChart width={400} height={400} {data} innerRadius={30} outerRadius={150} {...chartProps}
  >{#if tooltip}<Tooltip />{/if}<RadialBar dataKey="value" isAnimationActive={false} {...barProps}
    >{#if cells}{#each data as entry, index (index)}<Cell fill={String(entry.color)} />{/each}{/if}{#if labelList}<LabelList position="insideStart" dataKey="name" />{/if}</RadialBar
  ><PolarRadiusAxis tick={false} axisLine={false} /></RadialBarChart
>
