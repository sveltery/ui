<script lang="ts">
  import { BarChart, PieChart } from '@sveltery/recharts';

  const data = [
    { name: 'a', uv: 1 },
    { name: 'b', uv: 2 }
  ];
</script>

<div data-slot="card">
  <div data-slot="card-title">BarChart</div>
  <div data-slot="chart"><BarChart width={500} height={300} {data} /></div>
</div>
<div data-slot="card">
  <div data-slot="card-title">BarChart accessibilityLayer=false</div>
  <div data-slot="chart"><BarChart width={500} height={300} {data} accessibilityLayer={false} /></div>
</div>
<div data-slot="card">
  <div data-slot="card-title">PieChart</div>
  <div data-slot="chart"><PieChart width={500} height={300} /></div>
</div>
