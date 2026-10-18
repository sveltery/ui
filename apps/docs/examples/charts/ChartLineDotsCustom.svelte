<script lang="ts">
  import { CartesianGrid, Line, LineChart, XAxis, type SvelteArgs, type DotItemDotProps } from '@sveltery/charts';
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
  <CardHeader>
    <CardTitle>Line Chart - Custom Dots</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
        <ChartTooltip cursor={false}>
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent hideLabel {...props} />
          {/snippet}
        </ChartTooltip>
        <Line dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2}>
          {#snippet dot({ cx, cy }: SvelteArgs<DotItemDotProps>)}
            {#if !(cx == null || cy == null)}{const r = 24}<IconPlaceholder
              lucide="GitCommitVerticalIcon"
              tabler="IconGitCommit"
              hugeicons="GitCommitIcon"
              phosphor="GitCommitIcon"
              remixicon="RiGitCommitLine"
              x={cx - r / 2}
              y={cy - r / 2}
              width={r}
              height={r}
              fill="hsl(var(--background))"
              stroke="var(--color-desktop)"
            />{/if}
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
