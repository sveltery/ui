<script lang="ts" generics="T">
  import BarChart from '../../../src/chart/BarChart.svelte';
  import type { RechartsRootState } from '../../../src/state/store.js';
  import SelectorProbe, { type ProbeApi } from './SelectorProbe.svelte';

  let { selector, onready }: { selector: (state: RechartsRootState) => T; onready: (api: ProbeApi<T>) => void } = $props();
</script>

<BarChart width={500} height={300} data={[{ uv: 1 }]}><SelectorProbe {selector} {onready} /></BarChart>
