<script lang="ts">
  import { PolarAngleAxis, PolarGrid, Radar, RadarChart, type SvelteArgs, type LegendContentProps } from '@sveltery/charts';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig, type TooltipContentArgs } from '$registry/bases/base/ui/chart';
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
</script>

<Card>
  <CardHeader class="items-center">
    <CardTitle>Radar Chart - Legend</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <RadarChart
        data={chartData}
        margin={{
          top: -40,
          bottom: -10,
          left: 0,
          right: 0,
        }}
      >
        <ChartTooltip cursor={false}>
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent indicator="line" {...props} />
          {/snippet}
        </ChartTooltip>
        <PolarAngleAxis dataKey="month" />
        <PolarGrid />
        <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.6} />
        <Radar dataKey="mobile" fill="var(--color-mobile)" />
        <ChartLegend class="mt-8">
          {#snippet content(props: SvelteArgs<LegendContentProps>)}
            <ChartLegendContent {...props} />
          {/snippet}
        </ChartLegend>
      </RadarChart>
    </ChartContainer>
  </CardContent>
  <CardFooter class="flex-col gap-2 pt-4 text-sm">
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
