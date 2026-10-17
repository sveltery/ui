<svelte:options namespace="svg" />

<script lang="ts">
  import BarChart from '../../../src/chart/BarChart.svelte';
  import ZIndexLayer from '../../../src/zIndex/ZIndexLayer.svelte';

  let open = $state(true);
  let zIndex = $state(100);

  export function setOpen(next: boolean) {
    open = next;
  }

  export function setZIndex(next: number) {
    zIndex = next;
  }
</script>

<BarChart width={500} height={300} data={[{ uv: 1 }]}>{#if open}<ZIndexLayer {zIndex}><rect class="probe" /></ZIndexLayer>{/if}</BarChart>
