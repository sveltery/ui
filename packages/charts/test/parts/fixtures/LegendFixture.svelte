<script lang="ts">
  import BarChart from '../../../src/chart/BarChart.svelte';
  import Bar from '../../../src/cartesian/Bar.svelte';
  import Legend from '../../../src/component/Legend.svelte';
  import Tooltip from '../../../src/component/Tooltip.svelte';

  let { data, legendProps = {} }: { data: Record<string, unknown>[]; legendProps?: Record<string, unknown> } = $props();
</script>

<BarChart width={500} height={300} {data}
  ><Tooltip /><Legend {...legendProps} /><Bar dataKey="uv" fill="red" isAnimationActive={false} /><Bar dataKey="pv" name="Page views" fill="blue" isAnimationActive={false} /></BarChart
>
