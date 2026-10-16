<script lang="ts">
  import { LineChart } from 'layerchart';
  import { scaleUtc } from 'd3-scale';
  import { curveNatural } from 'd3-shape';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '$registry/bases/base/ui/chart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const chartData = [
    { date: new Date('2024-01-01'), desktop: 186 },
    { date: new Date('2024-02-01'), desktop: 305 },
    { date: new Date('2024-03-01'), desktop: 237 },
    { date: new Date('2024-04-01'), desktop: 73 },
    { date: new Date('2024-05-01'), desktop: 209 },
    { date: new Date('2024-06-01'), desktop: 214 },
  ];

  const chartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  } satisfies ChartConfig;
</script>

<Card class="w-full max-w-md">
  <CardHeader>
    <CardTitle>Line Chart - Label</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer aria-label="Line Chart - Label" config={chartConfig}>
      <LineChart
        points={{ r: 4 }}
        labels={{ offset: 12 }}
        data={chartData}
        x="date"
        axis="x"
        xScale={scaleUtc()}
        series={[
          {
            key: 'desktop',
            label: 'Desktop',
            color: 'var(--color-desktop)',
          },
        ]}
        props={{
          spline: { curve: curveNatural, motion: 'tween', strokeWidth: 2 },
          highlight: {
            points: {
              motion: 'none',
              r: 6,
            },
          },
          xAxis: {
            format: (v: Date) => v.toLocaleDateString('en-US', { month: 'short' }),
          },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip
            labelFormatter={(v: Date) => {
              return v.toLocaleDateString('en-US', {
                month: 'long',
              });
            }}
            indicator="line"
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
