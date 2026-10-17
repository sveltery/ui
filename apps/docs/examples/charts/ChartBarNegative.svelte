<script lang="ts">
  import { Bar, BarChart, CartesianGrid, Cell, LabelList } from '@sveltery/recharts';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, type TooltipContentArgs } from '$registry/bases/base/ui/chart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const chartData = [
    { month: "January", visitors: 186 },
    { month: "February", visitors: 205 },
    { month: "March", visitors: -207 },
    { month: "April", visitors: 173 },
    { month: "May", visitors: -209 },
    { month: "June", visitors: 214 },
  ]

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
  } satisfies ChartConfig
</script>

<Card>
  <CardHeader>
    <CardTitle>Bar Chart - Negative</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <ChartTooltip cursor={false}>
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent hideLabel hideIndicator {...props} />
          {/snippet}
        </ChartTooltip>
        <Bar dataKey="visitors">
          <LabelList position="top" dataKey="month" fillOpacity={1} />
          {#each chartData as item (item.month)}
            <Cell fill={item.visitors > 0 ? "var(--chart-1)" : "var(--chart-2)"} />
          {/each}
        </Bar>
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
