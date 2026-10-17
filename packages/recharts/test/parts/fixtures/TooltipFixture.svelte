<script lang="ts">
  import BarChart from '../../../src/chart/BarChart.svelte';
  import LineChart from '../../../src/chart/LineChart.svelte';
  import Bar from '../../../src/cartesian/Bar.svelte';
  import Line from '../../../src/cartesian/Line.svelte';
  import XAxis from '../../../src/cartesian/XAxis.svelte';
  import Tooltip from '../../../src/component/Tooltip.svelte';

  let { data, kind = 'bar', tooltipProps = {} }: { data: Record<string, unknown>[]; kind?: 'bar' | 'line'; tooltipProps?: Record<string, unknown> } = $props();
</script>

{#if kind === 'bar'}
  <BarChart width={500} height={300} {data}><XAxis dataKey="name" /><Tooltip isAnimationActive={false} {...tooltipProps} /><Bar dataKey="uv" fill="red" isAnimationActive={false} /></BarChart>
{:else}
  <LineChart width={500} height={300} {data}><XAxis dataKey="name" /><Tooltip isAnimationActive={false} {...tooltipProps} /><Line dataKey="uv" isAnimationActive={false} /></LineChart>
{/if}
