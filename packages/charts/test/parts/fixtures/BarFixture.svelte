<script lang="ts">
  import BarChart from '../../../src/chart/BarChart.svelte';
  import Bar from '../../../src/cartesian/Bar.svelte';
  import XAxis from '../../../src/cartesian/XAxis.svelte';
  import Cell from '../../../src/component/Cell.svelte';
  import LabelList from '../../../src/component/LabelList.svelte';

  let { data, barProps = {}, cells = false, labelList = false, layout = 'horizontal' }: { data: Record<string, unknown>[]; barProps?: Record<string, unknown>; cells?: boolean; labelList?: boolean; layout?: 'horizontal' | 'vertical' } = $props();
</script>

<BarChart width={500} height={300} {data} {layout}
  >{#if layout === 'horizontal'}<XAxis dataKey="name" />{/if}<Bar dataKey="uv" fill="red" isAnimationActive={false} {...barProps}
    >{#if cells}{#each data as entry, index (index)}<Cell fill={String(entry.color)} />{/each}{/if}{#if labelList}<LabelList position="top" />{/if}</Bar
  ></BarChart
>
