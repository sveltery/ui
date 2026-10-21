<script lang="ts">
  import { CartesianGrid, Dot, Line, LineChart, type SvelteArgs, type DotItemDotProps } from '@sveltery/charts';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, type TooltipContentArgs } from '$registry/bases/base/ui/chart-legacy';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
  ]

  const chartConfig = {
    visitors: {
      label: "Visitors",
      color: "var(--chart-2)",
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
</script>

<Card>
  <CardHeader>
    <CardTitle>Line Chart - Dots Colors</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 24,
          left: 24,
          right: 24,
        }}
      >
        <CartesianGrid vertical={false} />
        <ChartTooltip cursor={false}>
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent indicator="line" nameKey="visitors" hideLabel {...props} />
          {/snippet}
        </ChartTooltip>
        <Line dataKey="visitors" type="natural" stroke="var(--color-visitors)" strokeWidth={2}>
          {#snippet dot({ payload, ...props }: SvelteArgs<DotItemDotProps>)}
            <Dot r={5} cx={props.cx} cy={props.cy} fill={payload.fill} stroke={payload.fill} />
          {/snippet}
        </Line>
      </LineChart>
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
