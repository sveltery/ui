<script lang="ts">
  import LineChart from '../../../src/chart/LineChart.svelte';
  import Line from '../../../src/cartesian/Line.svelte';
  import XAxis from '../../../src/cartesian/XAxis.svelte';

  let { data, lineProps = {} }: { data: Record<string, unknown>[]; lineProps?: Record<string, unknown> } = $props();
</script>

<LineChart width={500} height={300} {data}><XAxis dataKey="name" /><Line dataKey="uv" isAnimationActive={false} {...lineProps} /></LineChart>
