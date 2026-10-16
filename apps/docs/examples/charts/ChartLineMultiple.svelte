<script lang="ts">
  import { LineChart } from 'layerchart';
  import { scaleUtc } from 'd3-scale';
  import { curveNatural } from 'd3-shape';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '$registry/bases/base/ui/chart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const chartData = [
    { date: new Date('2024-01-01'), desktop: 186, mobile: 80 },
    { date: new Date('2024-02-01'), desktop: 305, mobile: 200 },
    { date: new Date('2024-03-01'), desktop: 237, mobile: 120 },
    { date: new Date('2024-04-01'), desktop: 73, mobile: 190 },
    { date: new Date('2024-05-01'), desktop: 209, mobile: 130 },
    { date: new Date('2024-06-01'), desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  } satisfies ChartConfig;
</script>

<Card class="w-full max-w-md">
  <CardHeader>
    <CardTitle>Line Chart - Multiple</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer aria-label="Line Chart - Multiple" config={chartConfig}>
      <LineChart
        data={chartData}
        x="date"
        xScale={scaleUtc()}
        axis="x"
        series={[
          {
            key: 'desktop',
            label: 'Desktop',
            color: 'var(--color-desktop)',
          },
          {
            key: 'mobile',
            label: 'Mobile',
            color: 'var(--color-mobile)',
          },
        ]}
        props={{
          spline: { curve: curveNatural, motion: 'tween', strokeWidth: 2 },
          xAxis: {
            format: (v: Date) => v.toLocaleDateString('en-US', { month: 'short' }),
          },
          highlight: { points: { r: 4 } },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip
            labelFormatter={(v: Date) => v.toLocaleDateString('en-US', { month: 'long' })}
          />
        {/snippet}
      </LineChart>
    </ChartContainer>
  </CardContent>
  <CardFooter>
    <div class="flex w-full items-start gap-2 text-sm">
      <div class="grid gap-2">
        <div class="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <IconPlaceholder
            lucide="TrendingUpIcon"
            tabler="IconTrendingUp"
            hugeicons="TradeUpIcon"
            phosphor="TrendUpIcon"
            remixicon="RiLineChartLine"
            class="size-4"
          />
        </div>
        <div class="text-muted-foreground flex items-center gap-2 leading-none">
          January - June 2024
        </div>
      </div>
    </div>
  </CardFooter>
</Card>
