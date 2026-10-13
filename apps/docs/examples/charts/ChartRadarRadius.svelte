<script lang="ts">
  import { LineChart } from 'layerchart';
  import { curveLinearClosed } from 'd3-shape';
  import { scaleBand } from 'd3-scale';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/ui/chart';
  import { IconPlaceholder } from '@sveltery/ui/icons';

  const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  } satisfies ChartConfig;
</script>

<Card class="w-full max-w-md">
  <CardHeader class="items-center">
    <CardTitle>Radar Chart - Radius Axis</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent class="flex-1">
    <ChartContainer aria-label="Radar Chart - Radius Axis" config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <LineChart
        data={chartData}
        series={[
          {
            key: 'desktop',
            label: 'Desktop',
            color: 'var(--color-desktop)',
            props: {
              fill: 'var(--color-desktop)',
              fillOpacity: 0.6,
            },
          },
          {
            key: 'mobile',
            label: 'Mobile',
            color: 'var(--color-mobile)',
            props: {
              fill: 'var(--color-mobile)',
            },
          },
        ]}
        radial
        x="month"
        y="desktop"
        xScale={scaleBand()}
        padding={12}
        props={{
          spline: {
            curve: curveLinearClosed,
            stroke: '0',
            motion: 'tween',
          },
          yAxis: {
            format: 'metric',
          },
          grid: {
            yTicks: 6,
            radialY: 'linear',
          },
          tooltip: {
            context: {
              mode: 'band',
            },
          },
          highlight: {
            lines: false,
            points: { r: 4 },
          },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip indicator="line" />
        {/snippet}
      </LineChart>
    </ChartContainer>
  </CardContent>
  <CardFooter class="flex-col gap-2 text-sm">
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
  </CardFooter>
</Card>
