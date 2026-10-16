<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from '$registry/bases/base/ui/chart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { scaleBand } from 'd3-scale';
  import { BarChart, Highlight, type ChartContextValue } from 'layerchart';
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
  } satisfies ChartConfig;

  let context = $state<ChartContextValue>();
</script>

<Card class="w-full max-w-md">
  <CardHeader>
    <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer aria-label="Bar Chart - Stacked + Legend" config={chartConfig}>
      <BarChart
        bind:context
        data={chartData}
        xScale={scaleBand().padding(0.25)}
        x="month"
        axis="x"
        rule={false}
        series={[
          {
            key: 'desktop',
            label: 'Desktop',
            color: 'var(--color-desktop)',
            props: { rounded: 'bottom' },
          },
          {
            key: 'mobile',
            label: 'Mobile',
            color: 'var(--color-mobile)',
          },
        ]}
        seriesLayout="stack"
        props={{
          bars: {
            stroke: 'none',
            initialY: context?.height,
            initialHeight: 0,
            motion: {
              y: { type: 'tween', duration: 500, easing: cubicInOut },
              height: { type: 'tween', duration: 500, easing: cubicInOut },
            },
          },
          highlight: { area: false },
          xAxis: { format: (d) => d.slice(0, 3) },
        }}
      >
        {#snippet belowMarks()}
          <Highlight area={{ class: 'fill-muted' }} />
        {/snippet}

        {#snippet tooltip()}
          <ChartTooltip hideLabel />
        {/snippet}
        {#snippet legend()}
          <ChartLegend />
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
