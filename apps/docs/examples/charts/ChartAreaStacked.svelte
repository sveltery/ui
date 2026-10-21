<script lang="ts">
  import { areaY, d3Curve, defineChart, stack } from '@tanstack/charts';
  import { scaleLinear } from '@tanstack/charts/scales/linear';
  import { scalePoint } from '@tanstack/charts/scales/point';
  import { fold } from '@tanstack/charts/transform/fold';
  import { curveNatural } from 'd3-shape';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartTooltipContent, chartColors, type ChartConfig } from '$registry/bases/base/ui/chart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const series = ["mobile", "desktop"] as const

  const definition = defineChart({
    marks: [
      areaY(fold(chartData, { fields: series, as: { key: "series", value: "visitors" } }), {
        x: "month",
        y: "visitors",
        z: "series",
        color: "series",
        layout: stack({ order: series }),
        curve: d3Curve(curveNatural),
        fillOpacity: 0.4,
        stroke: (row) => `var(--color-${row.series})`,
      }),
    ],
    scales: {
      x: { scale: scalePoint, axis: { line: false, ticks: { size: 0, padding: 8, format: (value: string) => value.slice(0, 3) } } },
      y: { scale: scaleLinear, grid: true, axis: false },
    },
    color: chartColors(series),
    margin: { left: 12, right: 12 },
    focus: "group-x",
  })
</script>

<Card>
  <CardHeader>
    <CardTitle>Area Chart - Stacked</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig} {definition} ariaLabel="Area Chart - Stacked">
      {#snippet tooltip(props)}
        <ChartTooltipContent indicator="dot" {...props} />
      {/snippet}
    </ChartContainer>
  </CardContent>
  <CardFooter>
    <div class="flex w-full items-start gap-2 text-sm">
      <div class="grid gap-2">
        <div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month <IconPlaceholder
            lucide="TrendingUpIcon"
            tabler="IconTrendingUp"
            hugeicons="TradeUpIcon"
            phosphor="TrendUpIcon"
            remixicon="RiLineChartLine"
            class="h-4 w-4"
          /></div>
        <div class="flex items-center gap-2 leading-none text-muted-foreground">January - June 2024</div>
      </div>
    </div>
  </CardFooter>
</Card>
