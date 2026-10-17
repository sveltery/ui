<script lang="ts">
  import { scaleBand } from 'd3-scale';
  import { BarChart } from 'layerchart';
  import { Badge } from '$registry/bases/base/ui/badge';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent, CardDescription, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '$registry/bases/base/ui/chart';

  const activityData = [
    { month: 'Jan', amount: 40 },
    { month: 'Feb', amount: 55 },
    { month: 'Mar', amount: 35 },
    { month: 'Apr', amount: 60 },
    { month: 'May', amount: 45 },
    { month: 'Jun', amount: 50 },
    { month: 'Jul', amount: 65 },
    { month: 'Aug', amount: 40 },
    { month: 'Sep', amount: 55 },
    { month: 'Oct', amount: 70 },
    { month: 'Nov', amount: 45 },
    { month: 'Dec', amount: 80 }
  ];
  const chartConfig = {
    amount: {
      label: 'Activity',
      color: 'var(--chart-2)'
    }
  } satisfies ChartConfig;
</script>

<div class="grid grid-cols-2 gap-3">
  <Card>
    <CardContent>
      <CardDescription>Card Balance</CardDescription>
      <CardTitle class="text-2xl tabular-nums">US$12.94</CardTitle>
      <CardDescription class="tabular-nums">US$11,337.06 Available</CardDescription>
    </CardContent>
  </Card>
  <Card class="flex flex-col justify-between">
    <CardContent class="flex flex-1 flex-col justify-between">
      <div class="flex flex-col gap-1">
        <CardDescription>Payment Due</CardDescription>
        <CardTitle class="text-2xl">1 Apr</CardTitle>
      </div>
      <Button variant="outline" size="sm" class="mt-3 w-full">Pay Early</Button>
    </CardContent>
  </Card>
  <Card class="col-span-2">
    <CardContent class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <CardDescription>Yearly Activity</CardDescription>
        <Badge variant="secondary">+US$0.25 Daily Cash</Badge>
      </div>
          <ChartContainer aria-label="Yearly activity by month" config={chartConfig} class="h-20 w-full">
            <BarChart
              data={activityData}
              x="month"
              xScale={scaleBand().padding(0.25)}
              series={[{ key: 'amount', label: 'Activity', color: 'var(--color-amount)' }]}
              axis="x"
              grid={false}
              rule={false}
              padding={{ top: 4, bottom: 16, left: 0, right: 0 }}
              props={{
                bars: { stroke: 'none', strokeWidth: 0, rounded: 'top', radius: 3 },
                highlight: { area: { fill: 'none' } },
                xAxis: { format: (month: string) => month.slice(0, 1), tickLength: 10, class: 'text-[10px]' }
              }}
            >
              {#snippet tooltip()}
                <ChartTooltip hideLabel />
              {/snippet}
            </BarChart>
          </ChartContainer>
    </CardContent>
  </Card>
</div>
