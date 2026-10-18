<script lang="ts">
  import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart, type SvelteArgs, type LabelContentProps } from '@sveltery/charts';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, type ChartConfig } from '$registry/bases/base/ui/chart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const chartData = [
    { browser: "safari", visitors: 1260, fill: "var(--color-safari)" },
  ]

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig
</script>

<Card class="flex flex-col">
  <CardHeader class="items-center pb-0">
    <CardTitle>Radial Chart - Shape</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent class="flex-1 pb-0">
    <ChartContainer config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <RadialBarChart data={chartData} endAngle={100} innerRadius={65} outerRadius={95}>
        <PolarGrid gridType="circle" radialLines={false} stroke="none" class="first:fill-muted last:fill-background" polarRadius={[86, 74]} />
        <RadialBar dataKey="visitors" background />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label>
            {#snippet content({ viewBox }: SvelteArgs<LabelContentProps>)}
              {#if viewBox && "cx" in viewBox && "cy" in viewBox}<text x={viewBox.cx} y={viewBox.cy} text-anchor="middle" dominant-baseline="middle">
                <tspan x={viewBox.cx} y={viewBox.cy} class="fill-foreground text-4xl font-bold">{chartData[0].visitors.toLocaleString()}</tspan>
                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} class="fill-muted-foreground">Visitors</tspan>
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
