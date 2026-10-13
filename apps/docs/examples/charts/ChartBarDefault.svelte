<script lang="ts">
  import { scaleBand } from 'd3-scale';
  import { BarChart, type ChartContextValue } from 'layerchart';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/ui/chart';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { cubicInOut } from 'svelte/easing';

  const chartData = [
    { month: 'January', desktop: 186 },
    { month: 'February', desktop: 305 },
    { month: 'March', desktop: 237 },
    { month: 'April', desktop: 73 },
    { month: 'May', desktop: 209 },
    { month: 'June', desktop: 214 },
  ];

  const chartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  } satisfies ChartConfig;

  let context = $state<ChartContextValue>();
</script>

<Card class="w-full max-w-md">
  <CardHeader>
    <CardTitle>Bar Chart</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer aria-label="Bar Chart" config={chartConfig}>
      <BarChart
        bind:context
        data={chartData}
        xScale={scaleBand().padding(0.25)}
        x="month"
        axis="x"
        series={[{ key: 'desktop', label: 'Desktop', color: 'var(--color-desktop)' }]}
        props={{
          bars: {
            stroke: 'none',
            rounded: 'all',
            radius: 8,
            // use the height of the chart to animate the bars
            initialY: context?.height,
            initialHeight: 0,
            motion: {
              x: { type: 'tween', duration: 500, easing: cubicInOut },
              width: { type: 'tween', duration: 500, easing: cubicInOut },
              height: { type: 'tween', duration: 500, easing: cubicInOut },
              y: { type: 'tween', duration: 500, easing: cubicInOut },
            },
          },
          highlight: { area: { fill: 'none' } },
          xAxis: { format: (d) => d.slice(0, 3) },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip hideLabel />
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
