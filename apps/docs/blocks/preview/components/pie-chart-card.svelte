<script lang="ts">
  import { Label, Pie, PieChart, type SvelteArgs, type LabelContentProps, type LegendContentProps } from '@sveltery/charts';
  import { Badge } from '$registry/bases/base/ui/badge';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig, type TooltipContentArgs } from '$registry/bases/base/ui/chart';
  import { Progress } from '$registry/bases/base/ui/progress';

  const pieChartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  ]

  const pieChartConfig = {
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
  } satisfies ChartConfig

  const totalVisitors = $derived(pieChartData.reduce(
    (sum, item) => sum + item.visitors,
    0
  ));

  const topBrowser = $derived(pieChartData.reduce((max, item) =>
    item.visitors > max.visitors ? item : max
  ));

  const topBrowserShare = $derived(Math.round(
    (topBrowser.visitors / totalVisitors) * 100
  ));

  const topBrowserLabel = $derived(pieChartConfig[topBrowser.browser as keyof typeof pieChartConfig]?.label ??
  "Top");
</script>

<Card>
  <CardHeader class="pb-0">
    <CardTitle>Browser Share</CardTitle>
    <CardDescription>January - June 2026</CardDescription>
    <CardAction>
      <Badge variant="outline">{topBrowserLabel}</Badge>
    </CardAction>
  </CardHeader>
  <CardContent class="pt-0">
    <ChartContainer config={pieChartConfig} class="mx-auto aspect-square max-h-[190px]">
      <PieChart>
        <ChartTooltip cursor={false}>
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent hideLabel {...props} />
          {/snippet}
        </ChartTooltip>
        <Pie data={pieChartData} dataKey="visitors" nameKey="browser" innerRadius={50} strokeWidth={5}>
          <Label>
            {#snippet content({ viewBox }: SvelteArgs<LabelContentProps>)}
              {#if viewBox && "cx" in viewBox && "cy" in viewBox}<text x={viewBox.cx} y={viewBox.cy} text-anchor="middle" dominant-baseline="middle" fill="red">
                <tspan x={viewBox.cx} y={viewBox.cy - 16} class="fill-foreground text-2xl font-bold">{totalVisitors.toLocaleString()}</tspan>
                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} class="fill-muted-foreground text-xs">Visitors</tspan>
              </text>{/if}
            {/snippet}
          </Label>
        </Pie>
        <ChartLegend class="translate-y-2">
          {#snippet content(props: SvelteArgs<LegendContentProps>)}
            <ChartLegendContent nameKey="browser" {...props} />
          {/snippet}
        </ChartLegend>
      </PieChart>
    </ChartContainer>
  </CardContent>
  <CardFooter class="flex-col items-stretch gap-2">
    <div class="flex items-center text-xs">
      <span class="font-medium">{topBrowserLabel}</span>
      <span class="ml-auto text-muted-foreground tabular-nums">{topBrowserShare}%</span>
    </div>
    <Progress value={topBrowserShare} class="**:data-[slot=progress-indicator]:bg-chart-3" />
  </CardFooter>
</Card>
