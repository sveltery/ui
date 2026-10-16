<script lang="ts">
  import { scaleUtc } from 'd3-scale';
  import { curveNatural } from 'd3-shape';
  import { AreaChart } from 'layerchart';
  import { Badge } from '$registry/bases/base/ui/badge';
  import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '$registry/bases/base/ui/chart';

  const areaChartData = [
    { month: 'January', desktop: 186 },
    { month: 'February', desktop: 305 },
    { month: 'March', desktop: 237 },
    { month: 'April', desktop: 73 },
    { month: 'May', desktop: 209 },
    { month: 'June', desktop: 214 }
  ].map((row, index) => ({ ...row, date: new Date(Date.UTC(2024, index, 1)) }));

  const areaChartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'var(--chart-1)'
    }
  } satisfies ChartConfig;

  const latestVisitors = areaChartData[areaChartData.length - 1]?.desktop ?? 0;
  const previousVisitors = areaChartData[areaChartData.length - 2]?.desktop ?? latestVisitors;
  const trendPercent = previousVisitors === 0 ? 0 : Math.round(((latestVisitors - previousVisitors) / previousVisitors) * 100);
  const trendPrefix = trendPercent > 0 ? '+' : '';
  const longMonth = (value: Date) => value.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
</script>

<Card class="pb-0">
  <CardHeader>
    <CardTitle>Visitors</CardTitle>
    <CardDescription>Last 6 months</CardDescription>
    <CardAction>
      <Badge variant={trendPercent >= 0 ? 'secondary' : 'destructive'}>{trendPrefix}{trendPercent}% vs last month</Badge>
    </CardAction>
  </CardHeader>
  <CardContent class="px-0">
    <ChartContainer aria-label="Visitors by month" config={areaChartConfig} class="h-48 w-full">
      <AreaChart
        data={areaChartData}
        x="date"
        xScale={scaleUtc()}
        series={[{ key: 'desktop', label: 'Desktop', color: 'var(--color-desktop)' }]}
        axis={false}
        grid={false}
        padding={{ top: 6 }}
        props={{ area: { curve: curveNatural, 'fill-opacity': 0.15, line: { class: 'stroke-2' }, motion: 'tween' } }}
      >
        {#snippet tooltip()}
          <ChartTooltip labelFormatter={longMonth} indicator="line" />
        {/snippet}
      </AreaChart>
    </ChartContainer>
  </CardContent>
</Card>
