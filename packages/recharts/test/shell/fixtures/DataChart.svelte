<script lang="ts">
  import BarChart from '../../../src/chart/BarChart.svelte';
  import type { ChartData } from '../../../src/state/chartDataSlice.js';
  import SelectorProbe, { type ProbeApi } from './SelectorProbe.svelte';

  let { onready }: { onready: (api: ProbeApi<ChartData | undefined>) => void } = $props();

  const data = $state([
    { name: 'a', uv: 1 },
    { name: 'b', uv: 2 },
  ]);

  export function setUv(index: number, uv: number) {
    data[index].uv = uv;
  }

  export function push(name: string, uv: number) {
    data.push({ name, uv });
  }
</script>

<BarChart width={500} height={300} {data}><SelectorProbe selector={(state) => state.chartData.chartData} {onready} /></BarChart>
