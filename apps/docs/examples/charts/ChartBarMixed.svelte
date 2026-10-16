<script lang="ts">
  import { BarChart } from 'layerchart';
  import { scaleBand } from 'd3-scale';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '$registry/bases/base/ui/chart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { cubicInOut } from 'svelte/easing';

  const chartData = [
    { browser: 'chrome', visitors: 275, color: 'var(--color-chrome)' },
    { browser: 'safari', visitors: 200, color: 'var(--color-safari)' },
    { browser: 'firefox', visitors: 187, color: 'var(--color-firefox)' },
    { browser: 'edge', visitors: 173, color: 'var(--color-edge)' },
    { browser: 'other', visitors: 90, color: 'var(--color-other)' },
  ];

  const chartConfig = {
    visitors: { label: 'Visitors' },
    chrome: { label: 'Chrome', color: 'var(--chart-1)' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
    firefox: { label: 'Firefox', color: 'var(--chart-3)' },
    edge: { label: 'Edge', color: 'var(--chart-4)' },
    other: { label: 'Other', color: 'var(--chart-5)' },
  } satisfies ChartConfig;
</script>

<Card class="w-full max-w-md">
  <CardHeader>
    <CardTitle>Bar Chart - Mixed</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer aria-label="Bar Chart - Mixed" config={chartConfig}>
      <BarChart
        data={chartData}
        orientation="horizontal"
        yScale={scaleBand().padding(0.25)}
        y="browser"
        x="visitors"
        cRange={chartData.map((c) => c.color)}
        c="color"
        padding={{ left: 48 }}
        grid={false}
        rule={false}
        axis="y"
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
            tickLength: 16,
            format: (d) => chartConfig[d as keyof typeof chartConfig].label,
          },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip hideLabel nameKey="visitors" />
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
