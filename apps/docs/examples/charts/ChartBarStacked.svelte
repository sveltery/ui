<script lang="ts">
  import { Bar, BarChart, CartesianGrid, XAxis, type SvelteArgs, type LegendContentProps } from '@sveltery/recharts';
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
  <CardHeader>
    <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
        <ChartTooltip>
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent hideLabel {...props} />
          {/snippet}
        </ChartTooltip>
        <ChartLegend>
          {#snippet content(props: SvelteArgs<LegendContentProps>)}
            <ChartLegendContent {...props} />
          {/snippet}
        </ChartLegend>
        <Bar dataKey="desktop" stackId="a" fill="var(--color-desktop)" radius={[0, 0, 4, 4]} />
        <Bar dataKey="mobile" stackId="a" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  </CardContent>
  <CardFooter class="flex-col items-start gap-2 text-sm">
    <div class="flex gap-2 leading-none font-medium">Trending up by 5.2% this month <IconPlaceholder
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
