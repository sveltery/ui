<script lang="ts">
  import { Grid, LineChart } from 'layerchart';
  import { curveLinearClosed } from 'd3-shape';
  import { scaleBand } from 'd3-scale';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '$registry/bases/base/ui/chart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const chartData = [
    { month: 'January', desktop: 186 },
    { month: 'February', desktop: 305 },
    { month: 'March', desktop: 237 },
    { month: 'April', desktop: 273 },
    { month: 'May', desktop: 209 },
    { month: 'June', desktop: 214 },
  ];

  const chartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  } satisfies ChartConfig;
</script>

<Card class="w-full max-w-md">
  <CardHeader class="items-center">
    <CardTitle>Radar Chart - Grid Custom</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent class="flex-1">
    <ChartContainer aria-label="Radar Chart - Grid Custom" config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <LineChart
        data={chartData}
        series={[
          {
            key: 'desktop',
            label: 'Desktop',
            color: 'var(--color-desktop)',
          },
        ]}
        radial
        x="month"
        xScale={scaleBand()}
        padding={12}
        props={{
          spline: {
            curve: curveLinearClosed,
            fill: 'var(--color-desktop)',
            fillOpacity: 0.6,
            stroke: '0',
            motion: 'tween',
          },
          xAxis: {
            tickLength: 0,
          },
          yAxis: {
            format: () => '',
          },
          tooltip: {
            context: {
              mode: 'band',
            },
          },
          highlight: {
            lines: false,
          },
        }}
      >
        {#snippet grid()}
          <Grid
            y
            radialY="linear"
            yTicks={[Math.max(...chartData.map((m) => m.desktop))]}
          />
        {/snippet}
        {#snippet tooltip()}
          <ChartTooltip hideLabel />
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
