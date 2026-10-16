<script lang="ts">
  import { scaleBand } from 'd3-scale';
  import { BarChart } from 'layerchart';
  import { Badge } from '@sveltery/components/badge';
  import { Button } from '@sveltery/components/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { type ChartConfig, ChartContainer } from '@sveltery/components/chart';

  const sleepChartData = [
    { hour: '10pm', deep: 0, light: 30, rem: 0 },
    { hour: '11pm', deep: 20, light: 10, rem: 0 },
    { hour: '12am', deep: 40, light: 0, rem: 10 },
    { hour: '1am', deep: 30, light: 5, rem: 15 },
    { hour: '2am', deep: 10, light: 20, rem: 30 },
    { hour: '3am', deep: 25, light: 10, rem: 20 },
    { hour: '4am', deep: 15, light: 25, rem: 10 },
    { hour: '5am', deep: 5, light: 35, rem: 15 },
    { hour: '6am', deep: 0, light: 20, rem: 25 }
  ];
  const sleepChartConfig = {
    deep: {
      label: 'Deep',
      color: 'var(--chart-1)'
    },
    light: {
      label: 'Light',
      color: 'var(--chart-2)'
    },
    rem: {
      label: 'REM',
      color: 'var(--chart-3)'
    }
  } satisfies ChartConfig;
</script>

<Card>
  <CardHeader>
    <CardTitle>Sleep Report</CardTitle>
    <CardDescription>Last night · 7h 24m</CardDescription>
  </CardHeader>
  <CardContent class="flex flex-col gap-3">
    <ChartContainer aria-label="Sleep stages by hour" config={sleepChartConfig} class="h-32 w-full">
      <BarChart
        data={sleepChartData}
        x="hour"
        xScale={scaleBand().padding(0.55)}
        series={[
          { key: 'deep', label: 'Deep', color: 'var(--color-deep)' },
          { key: 'light', label: 'Light', color: 'var(--color-light)' },
          { key: 'rem', label: 'REM', color: 'var(--color-rem)', props: { rounded: 'top', radius: 2 } }
        ]}
        seriesLayout="stack"
        axis={false}
        grid={false}
        rule={false}
        padding={0}
        tooltipContext={false}
        props={{ bars: { stroke: 'none', strokeWidth: 0, rounded: 'none' } }}
      />
    </ChartContainer>
    <div class="grid grid-cols-4 gap-2">
      {#each [
            { label: "Deep", value: "2h 10m" },
            { label: "Light", value: "3h 48m" },
            { label: "REM", value: "1h 26m" },
            { label: "Score", value: "84" },
          ] as s (s.label)}
        <div class="text-center">
          <div class="text-sm font-medium tabular-nums">{s.value}</div>
          <div class="text-xs text-muted-foreground">{s.label}</div>
        </div>
      {/each}
    </div>
  </CardContent>
  <CardFooter>
    <Badge variant="outline">Good</Badge>
    <Button variant="outline" size="sm" class="ml-auto">Details</Button>
  </CardFooter>
</Card>
