<script lang="ts">
  import { defineChart } from '@tanstack/charts';
  import { angleGrid, focusGroupAngle, polar, radialArea, radialGrid } from '@tanstack/charts/polar';
  import { scaleLinear } from '@tanstack/charts/scales/linear';
  import { scalePoint } from '@tanstack/charts/scales/point';
  import { curveLinearClosed } from 'd3-shape';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartTooltipContent, type ChartConfig } from '$registry/bases/base/ui/chart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 273 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ]

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  const definition = defineChart({
    marks: [
      polar({
        radiusRatio: 0.8,
        scales: {
          angle: { scale: scalePoint<string>().domain(chartData.map((row) => row.month)), wrap: true },
          radius: { scale: scaleLinear, nice: true },
        },
        guides: [radialGrid({ ticks: 5, shape: "polygon" }), angleGrid({ labelOffset: 10 })],
        marks: [
          radialArea(chartData, { angle: "month", radius: "desktop", z: () => "desktop", curve: curveLinearClosed, fill: "var(--color-desktop)", fillOpacity: 0.6, stroke: "none" }),
        ],
      }),
    ],
    scales: { x: null, y: null },
    margin: 0,
    focus: focusGroupAngle,
  })
</script>

<Card>
  <CardHeader class="items-center pb-4">
    <CardTitle>Radar Chart</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent class="pb-0">
    <ChartContainer config={chartConfig} {definition} ariaLabel="Radar Chart" class="mx-auto aspect-square max-h-[250px]">
      {#snippet tooltip(props)}
        <ChartTooltipContent {...props} />
      {/snippet}
    </ChartContainer>
  </CardContent>
  <CardFooter class="flex-col gap-2 text-sm">
    <div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month <IconPlaceholder
        lucide="TrendingUpIcon"
        tabler="IconTrendingUp"
        hugeicons="TradeUpIcon"
        phosphor="TrendUpIcon"
        remixicon="RiLineChartLine"
        class="h-4 w-4"
      /></div>
    <div class="flex items-center gap-2 leading-none text-muted-foreground">January - June 2024</div>
  </CardFooter>
</Card>
