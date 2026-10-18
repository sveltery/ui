<script lang="ts">
  import PieChart from '../../../src/chart/PieChart.svelte';
  import Pie from '../../../src/polar/Pie.svelte';
  import Cell from '../../../src/component/Cell.svelte';
  import LabelList from '../../../src/component/LabelList.svelte';
  import Label from '../../../src/component/Label.svelte';
  import Tooltip from '../../../src/component/Tooltip.svelte';

  let {
    data,
    pieProps = {},
    cells = false,
    labelList = false,
    label = false,
    tooltip = false,
  }: { data: Record<string, unknown>[]; pieProps?: Record<string, unknown>; cells?: boolean; labelList?: boolean; label?: boolean; tooltip?: boolean } = $props();
</script>

<PieChart width={400} height={400}
  >{#if tooltip}<Tooltip />{/if}<Pie {data} dataKey="value" nameKey="name" isAnimationActive={false} {...pieProps}
    >{#if cells}{#each data as entry, index (index)}<Cell fill={String(entry.color)} />{/each}{/if}{#if labelList}<LabelList dataKey="name" />{/if}{#if label}<Label value="center" position="center" />{/if}</Pie
  ></PieChart
>
