<script lang="ts">
  import { PolarGrid, PolarRadiusAxis, Radar, RadarChart } from '@sveltery/recharts';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, type TooltipContentArgs } from '$registry/bases/base/ui/chart';
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
  <CardHeader class="items-center pb-4">
    <CardTitle>Radar Chart - Radius Axis</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent class="pb-0">
    <ChartContainer config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <RadarChart data={chartData}>
        <ChartTooltip cursor={false}>
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent indicator="line" labelKey="month" {...props} />
          {/snippet}
        </ChartTooltip>
        <PolarGrid />
        <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.6} />
        <Radar dataKey="mobile" fill="var(--color-mobile)" />
        <PolarRadiusAxis angle={60} stroke="var(--foreground)" orientation="middle" axisLine={false} />
      </RadarChart>
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
