<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/components/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/components/chart';
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
    <CardTitle>Tooltip - Advanced</CardTitle>
    <CardDescription>Tooltip with custom formatter and total.</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer aria-label="Tooltip - Advanced" config={chartConfig}>
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
          <ChartTooltip hideLabel class="w-[180px]">
            {#snippet formatter({ item, name, index, value, data })}
              <div
                style="--color-bg: var(--color-{item.key})"
                class="size-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
              ></div>
              {name}
              <div
                class="text-foreground ms-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums"
              >
                {value}
                <span class="text-muted-foreground font-normal"> kcal </span>
              </div>
              <!-- Add this after the last item-->
              {#if index === 1}
                <div
                  class="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium"
                >
                  Total
                  <div
                    class="text-foreground ms-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums"
                  >
                    {Number(data.running) + Number(data.swimming)}
                    <span class="text-muted-foreground font-normal">
                      kcal
                    </span>
                  </div>
                </div>
              {/if}
            {/snippet}
          </ChartTooltip>
        {/snippet}
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
