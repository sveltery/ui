<script lang="ts">
  import AreaChart from '../../../src/chart/AreaChart.svelte';
  import Area from '../../../src/cartesian/Area.svelte';
  import XAxis from '../../../src/cartesian/XAxis.svelte';

  let { data, areaProps = {} }: { data: Record<string, unknown>[]; areaProps?: Record<string, unknown> } = $props();
</script>

<AreaChart width={500} height={300} {data}><XAxis dataKey="name" /><Area dataKey="uv" isAnimationActive={false} {...areaProps} /></AreaChart>
