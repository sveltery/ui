<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/ui/chart';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { BarChart } from 'layerchart';
  import { scaleBand } from 'd3-scale';
  import { cubicInOut } from 'svelte/easing';

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
    label: { color: 'var(--background)' },
  } satisfies ChartConfig;
</script>

<Card class="w-full max-w-md">
  <CardHeader>
    <CardTitle>Bar Chart - Custom Label</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer aria-label="Bar Chart - Custom Label" config={chartConfig}>
      <BarChart
        labels={{ offset: 12 }}
        data={chartData}
        orientation="horizontal"
        yScale={scaleBand().padding(0.25)}
        y="month"
        axis="y"
        rule={false}
        series={[{ key: 'desktop', label: 'Desktop', color: 'var(--color-desktop)' }]}
        padding={{ right: 16 }}
        props={{
          bars: {
            stroke: 'none',
            radius: 5,
            rounded: 'all',
            initialWidth: 0,
            initialX: 0,
            motion: {
              x: { type: 'tween', duration: 500, easing: cubicInOut },
              width: { type: 'tween', duration: 500, easing: cubicInOut },
            },
          },
          highlight: { area: { fill: 'none' } },
          yAxis: {
            tickLabelProps: {
              textAnchor: 'start',
              dx: 6,
              class: 'stroke-none fill-background!',
            },
            tickLength: 0,
          },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip indicator="line" />
        {/snippet}
      </BarChart>
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
          Showing total visitors for the last 6 months
        </div>
      </div>
    </div>
  </CardFooter>
</Card>
