<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/ui/chart';
  import { scaleBand } from 'd3-scale';
  import { BarChart, type ChartContextValue } from 'layerchart';
  import { cubicInOut } from 'svelte/easing';

  const chartData = [
    { date: '2024-07-15', running: 450, swimming: 300 },
    { date: '2024-07-16', running: 380, swimming: 420 },
    { date: '2024-07-17', running: 520, swimming: 120 },
    { date: '2024-07-18', running: 140, swimming: 550 },
    { date: '2024-07-19', running: 600, swimming: 350 },
    { date: '2024-07-20', running: 480, swimming: 400 },
  ];

  const chartConfig = {
    running: { label: 'Running', color: 'var(--chart-1)' },
    swimming: { label: 'Swimming', color: 'var(--chart-2)' },
  } satisfies ChartConfig;

  let context = $state<ChartContextValue>();
</script>

<Card class="w-full max-w-md">
  <CardHeader>
    <CardTitle>Tooltip - No Indicator</CardTitle>
    <CardDescription>Tooltip with no indicator.</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer aria-label="Tooltip - No Indicator" config={chartConfig}>
      <BarChart
        bind:context
        data={chartData}
        xScale={scaleBand().padding(0.25)}
        x="date"
        axis="x"
        rule={false}
        series={[
          {
            key: 'running',
            label: 'Running',
            color: 'var(--color-running)',
            props: { rounded: 'bottom' },
          },
          {
            key: 'swimming',
            label: 'Swimming',
            color: 'var(--color-swimming)',
          },
        ]}
        seriesLayout="stack"
        grid={false}
        highlight={false}
        props={{
          bars: {
            stroke: 'none',
            initialY: context?.height,
            initialHeight: 0,
            motion: {
              y: { type: 'tween', duration: 500, easing: cubicInOut },
              height: { type: 'tween', duration: 500, easing: cubicInOut },
            },
          },
          xAxis: {
            format: (d) =>
              new Date(d).toLocaleDateString('en-US', {
                weekday: 'short',
              }),
            tickLabelProps: {
              svgProps: {
                y: 13,
              },
            },
          },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip hideIndicator />
        {/snippet}
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
