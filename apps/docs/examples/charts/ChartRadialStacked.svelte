<script lang="ts">
  import { Label, PolarRadiusAxis, RadialBar, RadialBarChart, type SvelteArgs, type LabelContentProps } from '@sveltery/charts';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, type TooltipContentArgs } from '$registry/bases/base/ui/chart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const chartData = [{ month: "january", mobile: 570, desktop: 1260 }]

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

  const totalVisitors = $derived(chartData[0].desktop + chartData[0].mobile);
</script>

<Card class="flex flex-col">
  <CardHeader class="items-center pb-0">
    <CardTitle>Radial Chart - Stacked</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent class="flex flex-1 items-center pb-0">
    <ChartContainer config={chartConfig} class="mx-auto aspect-square w-full max-w-[250px]">
      <RadialBarChart data={chartData} endAngle={180} innerRadius={80} outerRadius={110}>
        <RadialBar dataKey="mobile" fill="var(--color-mobile)" stackId="a" cornerRadius={5} class="stroke-transparent stroke-2" />
        <RadialBar dataKey="desktop" stackId="a" cornerRadius={5} fill="var(--color-desktop)" class="stroke-transparent stroke-2" />
        <ChartTooltip cursor={false}>
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent hideLabel {...props} />
          {/snippet}
        </ChartTooltip>
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label>
            {#snippet content({ viewBox }: SvelteArgs<LabelContentProps>)}
              {#if viewBox && "cx" in viewBox && "cy" in viewBox}<text x={viewBox.cx} y={viewBox.cy} text-anchor="middle">
                <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} class="fill-foreground text-2xl font-bold">{totalVisitors.toLocaleString()}</tspan>
                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} class="fill-muted-foreground">Visitors</tspan>
              </text>{/if}
            {/snippet}
          </Label>
        </PolarRadiusAxis>
      </RadialBarChart>
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
