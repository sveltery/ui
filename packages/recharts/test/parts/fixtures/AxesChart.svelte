<script lang="ts">
  import BarChart from '../../../src/chart/BarChart.svelte';
  import CartesianGrid from '../../../src/cartesian/CartesianGrid.svelte';
  import XAxis from '../../../src/cartesian/XAxis.svelte';
  import YAxis from '../../../src/cartesian/YAxis.svelte';

  let { data, xProps = {}, yProps = {}, gridProps = {} }: { data: Record<string, unknown>[]; xProps?: Record<string, unknown>; yProps?: Record<string, unknown>; gridProps?: Record<string, unknown> } = $props();
</script>

<BarChart width={500} height={300} {data}>
  <CartesianGrid {...gridProps} />
  <XAxis dataKey="name" {...xProps} />
  <YAxis {...yProps} />
</BarChart>
