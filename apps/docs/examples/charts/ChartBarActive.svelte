<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/components/chart';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { scaleBand } from 'd3-scale';
  import { Bar, BarChart } from 'layerchart';
  import { cubicInOut } from 'svelte/easing';

  const chartData = [
    { browser: 'chrome', visitors: 187, color: 'var(--color-chrome)' },
    { browser: 'safari', visitors: 200, color: 'var(--color-safari)' },
    { browser: 'firefox', visitors: 275, color: 'var(--color-firefox)' },
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
    <CardTitle>Bar Chart - Active</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer aria-label="Bar Chart - Active" config={chartConfig}>
      <BarChart
        data={chartData}
        x="browser"
        c="color"
        y="visitors"
        cRange={chartData.map((c) => c.color)}
        xScale={scaleBand().padding(0.25)}
        axis="x"
        rule={false}
        props={{
          xAxis: {
            format: (d) => chartConfig[d as keyof typeof chartConfig].label,
          },
          highlight: { area: { fill: 'none' } },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip hideLabel nameKey="visitors" />
        {/snippet}
        {#snippet marks({ context })}
          {#each chartData as data, i (data.browser)}
            <Bar
              {data}
              fill={data.color}
              radius={8}
              rounded="all"
              initialY={context.height}
              initialHeight={0}
              motion={{
                y: { type: 'tween', duration: 500, easing: cubicInOut },
                height: { type: 'tween', duration: 500, easing: cubicInOut },
              }}
              fillOpacity={i === 2 ? 0.8 : undefined}
              stroke={i === 2 ? data.color : undefined}
              strokeWidth={i === 2 ? 2 : undefined}
              stroke-dasharray={i === 2 ? 4 : undefined}
              stroke-dashoffset={i === 2 ? 4 : undefined}
            />
          {/each}
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
