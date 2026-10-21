<script lang="ts">
  import { defineChart } from '@tanstack/charts';
  import { pie, polar, radialArc, radialText } from '@tanstack/charts/polar';
  import { scaleLinear } from '@tanstack/charts/scales/linear';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartTooltipContent, type ChartConfig } from '$registry/bases/base/ui/chart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 190, fill: "var(--color-other)" },
  ]

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "var(--chart-1)",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
    firefox: {
      label: "Firefox",
      color: "var(--chart-3)",
    },
    edge: {
      label: "Edge",
      color: "var(--chart-4)",
    },
    other: {
      label: "Other",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0)

  const definition = defineChart({
    marks: [
      polar({
        radiusRatio: 0.8,
        scales: { angle: { scale: scaleLinear().domain([0, 1]) }, radius: { scale: scaleLinear().domain([0, 1]) } },
        marks: [
          radialArc(pie(chartData, { value: "visitors", startAngle: Math.PI / 2, endAngle: -Math.PI * 1.5 }), {
            key: "browser",
            z: "browser",
            innerRadius: 60,
            fill: (row) => row.fill,
          }),
          radialText([{ id: "total", text: totalVisitors.toLocaleString() }], { angle: 0, radius: 0, text: "text", dy: -12, fill: "var(--foreground)", fontSize: 30, fontWeight: 700 }),
          radialText([{ id: "label", text: "Visitors" }], { angle: 0, radius: 0, text: "text", dy: 12, fill: "var(--muted-foreground)", fontSize: 12 }),
        ],
      }),
    ],
    scales: { x: null, y: null },
    margin: 0,
  })
</script>

<Card class="flex flex-col">
  <CardHeader class="items-center pb-0">
    <CardTitle>Pie Chart - Donut with Text</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent class="flex-1 pb-0">
    <ChartContainer config={chartConfig} {definition} ariaLabel="Pie Chart - Donut with Text" class="mx-auto aspect-square max-h-[250px]">
      {#snippet tooltip(props)}
        <ChartTooltipContent hideLabel nameKey="browser" {...props} />
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
    <div class="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
  </CardFooter>
</Card>
