<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/components/chart';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { LineChart } from 'layerchart';
  import { curveNatural } from 'd3-shape';
  import { scalePoint } from 'd3-scale';

  const chartData = [
    { browser: 'chrome', visitors: 275, color: 'var(--color-chrome)' },
    { browser: 'safari', visitors: 200, color: 'var(--color-safari)' },
    { browser: 'firefox', visitors: 187, color: 'var(--color-firefox)' },
    { browser: 'edge', visitors: 173, color: 'var(--color-edge)' },
    { browser: 'other', visitors: 90, color: 'var(--color-other)' },
  ];

  const chartConfig = {
    visitors: { label: 'Visitors', color: 'var(--chart-2)' },
    chrome: { label: 'Chrome', color: 'var(--chart-1)' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
    firefox: { label: 'Firefox', color: 'var(--chart-3)' },
    edge: { label: 'Edge', color: 'var(--chart-4)' },
    other: { label: 'Other', color: 'var(--chart-5)' },
  } satisfies ChartConfig;
</script>

<Card class="w-full max-w-md">
  <CardHeader>
    <CardTitle>Line Chart - Custom Label</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer aria-label="Line Chart - Custom Label" config={chartConfig}>
      <LineChart
        data={chartData}
        x="browser"
        xScale={scalePoint()}
        c="color"
        cRange={chartData.map((d) => d.color)}
        series={[{ key: 'visitors', value: 'visitors' }]}
        padding={{ left: 24, right: 24 }}
        yPadding={[0, 25]}
        axis={false}
        points={{ r: 5, stroke: 'none' }}
        labels={{ offset: 12, value: (d) => chartConfig[d.browser as keyof typeof chartConfig].label }}
        props={{
          spline: { curve: curveNatural, motion: 'tween', strokeWidth: 2, stroke: 'var(--color-visitors)' },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip hideLabel indicator="line" nameKey="browser" />
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
