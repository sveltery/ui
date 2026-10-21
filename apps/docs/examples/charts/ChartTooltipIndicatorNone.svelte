<script lang="ts">
  import { Bar, BarChart, XAxis } from '@sveltery/charts';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, type TooltipContentArgs } from '$registry/bases/base/ui/chart-legacy';

  const chartData = [
    { date: "2024-07-15", running: 450, swimming: 300 },
    { date: "2024-07-16", running: 380, swimming: 420 },
    { date: "2024-07-17", running: 520, swimming: 120 },
    { date: "2024-07-18", running: 140, swimming: 550 },
    { date: "2024-07-19", running: 600, swimming: 350 },
    { date: "2024-07-20", running: 480, swimming: 400 },
  ]

  const chartConfig = {
    running: {
      label: "Running",
      color: "var(--chart-1)",
    },
    swimming: {
      label: "Swimming",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig
</script>

<Card>
  <CardHeader>
    <CardTitle>Tooltip - No Indicator</CardTitle>
    <CardDescription>Tooltip with no indicator.</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            return new Date(value).toLocaleDateString("en-US", {
              weekday: "short",
            })
          }}
        />
        <Bar dataKey="running" stackId="a" fill="var(--color-running)" radius={[0, 0, 4, 4]} />
        <Bar dataKey="swimming" stackId="a" fill="var(--color-swimming)" radius={[4, 4, 0, 0]} />
        <ChartTooltip cursor={false} defaultIndex={1}>
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent hideIndicator {...props} />
          {/snippet}
        </ChartTooltip>
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
