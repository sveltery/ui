<script lang="ts">
  import BarChart from '../../../src/chart/BarChart.svelte';
  import SetCartesianGraphicalItem from '../../../src/state/SetCartesianGraphicalItem.svelte';
  import type { CartesianGraphicalItemSettings } from '../../../src/state/graphicalItemsSlice.js';
  import type { RechartsRootState } from '../../../src/state/store.js';
  import SelectorProbe, { type ProbeApi } from './SelectorProbe.svelte';

  type Items = RechartsRootState['graphicalItems']['cartesianItems'];
  let { onready }: { onready: (api: ProbeApi<Items>) => void } = $props();

  let items = $state([
    { id: 'a', dataKey: 'uv' },
    { id: 'b', dataKey: 'pv' },
    { id: 'c', dataKey: 'amt' },
  ]);

  export function setDataKey(id: string, dataKey: string) {
    const item = items.find((i) => i.id === id);
    if (item) item.dataKey = dataKey;
  }

  export function remove(id: string) {
    items = items.filter((i) => i.id !== id);
  }

  const settings = (item: { id: string; dataKey: string }) => ({ id: item.id, type: 'bar', dataKey: item.dataKey }) as unknown as CartesianGraphicalItemSettings;
</script>

<BarChart width={500} height={300} data={[{ uv: 1 }]}
  >{#each items as item (item.id)}<SetCartesianGraphicalItem {...settings(item)} />{/each}<SelectorProbe
    selector={(state) => state.graphicalItems.cartesianItems}
    {onready}
  /></BarChart
>
