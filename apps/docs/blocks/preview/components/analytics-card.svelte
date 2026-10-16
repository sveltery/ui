<script lang="ts">
  import { scaleUtc } from 'd3-scale';
  import { curveLinear } from 'd3-shape';
  import { AreaChart } from 'layerchart';
  import { Badge } from '$registry/bases/base/ui/badge';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '$registry/bases/base/ui/chart';

  const chartData = [
    { month: 'January', visitors: 186 },
    { month: 'February', visitors: 305 },
    { month: 'March', visitors: 237 },
    { month: 'April', visitors: 73 },
    { month: 'May', visitors: 209 },
    { month: 'June', visitors: 214 }
  ].map((row, index) => ({ ...row, date: new Date(Date.UTC(2024, index, 1)) }));

  const chartConfig = {
    visitors: {
      label: 'Visitors',
      color: 'var(--chart-1)'
    }
  } satisfies ChartConfig;
</script>

<Card class="mx-auto w-full max-w-sm data-[size=sm]:pb-0" size="sm">
  <CardHeader>
    <CardTitle>Analytics</CardTitle>
    <CardDescription>418.2K Visitors <Badge>+10%</Badge></CardDescription>
    <CardAction>
      <Button variant="outline" size="sm">View Analytics</Button>
    </CardAction>
  </CardHeader>
  <ChartContainer aria-label="Visitors by month" config={chartConfig} class="aspect-[1/0.35]">
    <AreaChart
      data={chartData}
      x="date"
      xScale={scaleUtc()}
      series={[{ key: 'visitors', label: 'Visitors', color: 'var(--color-visitors)' }]}
      axis={false}
      grid={false}
      padding={0}
      props={{ area: { curve: curveLinear, 'fill-opacity': 0.4, line: { class: 'stroke-1' }, motion: 'tween' } }}
    >
      {#snippet tooltip()}
        <ChartTooltip indicator="line" hideLabel />
      {/snippet}
    </AreaChart>
  </ChartContainer>
</Card>
