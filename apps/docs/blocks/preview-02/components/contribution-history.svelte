<script lang="ts">
  import { scaleBand } from 'd3-scale';
  import { BarChart } from 'layerchart';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '$registry/bases/base/ui/chart';
  import { Item, ItemContent, ItemDescription } from '$registry/bases/base/ui/item';

  const chartData = [
    { month: 'Dec', amount: 800 },
    { month: 'Jan', amount: 1100 },
    { month: 'Feb', amount: 900 },
    { month: 'Mar', amount: 1300 },
    { month: 'Apr', amount: 750 },
    { month: 'May', amount: 1400 }
  ];
  const chartConfig = {
    amount: {
      label: 'Contribution',
      color: 'var(--chart-2)'
    }
  } satisfies ChartConfig;
</script>

<Card>
  <CardHeader>
    <CardTitle>Contribution History</CardTitle>
    <CardDescription>Last 6 months of activity</CardDescription>
  </CardHeader>
  <CardContent>
        <ChartContainer aria-label="Contributions by month" config={chartConfig} class="h-[200px] w-full">
          <BarChart
            data={chartData}
            x="month"
            xScale={scaleBand().padding(0.2)}
            series={[{ key: 'amount', label: 'Contribution', color: 'var(--color-amount)' }]}
            axis="x"
            grid={false}
            rule={false}
            padding={{ top: 8, bottom: 24, left: 0, right: 0 }}
            props={{
              bars: { stroke: 'none', strokeWidth: 0, rounded: 'top', radius: 6 },
              highlight: { area: { fill: 'none' } },
              xAxis: { tickLength: 0 }
            }}
          >
            {#snippet tooltip()}
              <ChartTooltip hideLabel class="min-w-40" />
            {/snippet}
          </BarChart>
        </ChartContainer>
  </CardContent>
  <CardContent>
    <div class="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
      <Item variant="muted" class="flex-col items-stretch">
        <ItemContent class="gap-1">
          <ItemDescription class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Upcoming
          </ItemDescription>
          <span class="cn-font-heading text-lg font-semibold">May 25, 2024</span>
          <span class="text-sm text-muted-foreground">$1,000 scheduled</span>
        </ItemContent>
      </Item>
      <Item variant="muted" class="flex-col items-stretch">
        <ItemContent class="gap-1">
          <ItemDescription class="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Auto-Save Plan
          </ItemDescription>
          <span class="cn-font-heading text-lg font-semibold">Accelerated</span>
          <span class="text-sm text-muted-foreground">Recurring weekly</span>
        </ItemContent>
      </Item>
    </div>
  </CardContent>
  <CardFooter>
    <Button class="w-full">View Full Report</Button>
  </CardFooter>
</Card>
