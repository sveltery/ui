<script lang="ts">
  import { scaleBand } from 'd3-scale';
  import { BarChart } from 'layerchart';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '$registry/bases/base/ui/chart';
  import { Progress } from '$registry/bases/base/ui/progress';
  import { Separator } from '$registry/bases/base/ui/separator';

  const chartData = [
    { hour: '6a', usage: 1.2 },
    { hour: '8a', usage: 2.8 },
    { hour: '10a', usage: 3.1 },
    { hour: '12p', usage: 2.4 },
    { hour: '2p', usage: 3.4 },
    { hour: '4p', usage: 2.9 },
    { hour: '6p', usage: 3.8 },
    { hour: '8p', usage: 3.2 }
  ];
  const chartConfig = {
    usage: {
      label: 'Usage (kW)',
      color: 'var(--chart-2)'
    }
  } satisfies ChartConfig;
</script>

<Card>
  <CardHeader>
    <CardTitle>Power Usage</CardTitle>
    <CardDescription>Whole Home</CardDescription>
  </CardHeader>
  <CardContent class="flex flex-col gap-4">
        <ChartContainer aria-label="Power usage by hour" config={chartConfig} class="h-[140px] w-full">
          <BarChart
            data={chartData}
            x="hour"
            xScale={scaleBand().padding(0.25)}
            series={[{ key: 'usage', label: 'Usage (kW)', color: 'var(--color-usage)' }]}
            axis="x"
            grid={false}
            rule={false}
            padding={{ top: 4, bottom: 22, left: 0, right: 0 }}
            props={{
              bars: { stroke: 'none', strokeWidth: 0, rounded: 'top', radius: 4 },
              highlight: { area: { fill: 'none' } },
              xAxis: { tickLength: 12 }
            }}
          >
            {#snippet tooltip()}
              <ChartTooltip hideLabel />
            {/snippet}
          </BarChart>
        </ChartContainer>
    <Separator />
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-0.5">
        <span class="text-sm text-muted-foreground">Currently Using</span>
        <span class="text-lg font-semibold tabular-nums">3.4 kW</span>
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-sm text-muted-foreground">Solar Gen</span>
        <span class="text-lg font-semibold text-chart-1 tabular-nums">+1.2 kW</span>
      </div>
    </div>
  </CardContent>
  <CardFooter class="flex-col items-start gap-1">
    <span class="text-sm text-muted-foreground">Battery Level</span>
    <div class="flex w-full items-center gap-2">
      <Progress value={85} class="flex-1" />
      <span class="text-sm font-medium tabular-nums">85%</span>
    </div>
  </CardFooter>
</Card>
