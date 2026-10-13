<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/ui/chart';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { ArcChart } from 'layerchart';

  const chartData = [
    { browser: 'other', visitors: 90, color: 'var(--color-other)' },
    { browser: 'edge', visitors: 173, color: 'var(--color-edge)' },
    { browser: 'firefox', visitors: 187, color: 'var(--color-firefox)' },
    { browser: 'safari', visitors: 200, color: 'var(--color-safari)' },
    { browser: 'chrome', visitors: 275, color: 'var(--color-chrome)' },
  ];

  const chartConfig = {
    visitors: { label: 'Visitors' },
    chrome: { label: 'Chrome', color: 'var(--chart-1)' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
    firefox: { label: 'Firefox', color: 'var(--chart-3)' },
    edge: { label: 'Edge', color: 'var(--chart-4)' },
    other: { label: 'Other', color: 'var(--chart-5)' },
  } satisfies ChartConfig;
</script>

<Card class="w-full max-w-md">
  <CardHeader class="items-center">
    <CardTitle>Radial Chart</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent class="flex-1">
    <ChartContainer aria-label="Radial Chart" config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <ArcChart
        label="browser"
        value="visitors"
        outerRadius={-17}
        innerRadius={-12.5}
        padding={20}
        range={[90, -270]}
        maxValue={Math.max(...chartData.map((d) => d.visitors))}
        series={chartData.map((d) => ({
          key: d.browser,
          color: d.color,
          data: [d],
        }))}
        props={{
          arc: { track: { fill: 'var(--muted)' }, motion: 'tween' },
          tooltip: { context: { hideDelay: 350 } },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip>
            {#snippet children({ data })}
              <div class="border-border/50 bg-background flex min-w-[8rem] items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
                <div class="h-2.5 w-2.5 shrink-0 rounded-[2px]" style:background={data.color as string}></div>
                <span class="text-muted-foreground">{chartConfig[data.browser as keyof typeof chartConfig].label}</span>
                <span class="text-foreground ms-auto font-mono font-medium tabular-nums">{(data.visitors as number).toLocaleString()}</span>
              </div>
            {/snippet}
          </ChartTooltip>
        {/snippet}
      </ArcChart>
    </ChartContainer>
  </CardContent>
  <CardFooter class="flex-col gap-2 text-sm">
    <div class="flex items-center gap-2 leading-none font-medium">
      Trending up by 5.2% this month <IconPlaceholder
        lucide="TrendingUpIcon"
        tabler="IconTrendingUp"
        hugeicons="TradeUpIcon"
        phosphor="TrendUpIcon"
        remixicon="RiLineChartLine"
        class="size-4"
      />
    </div>
    <div class="text-muted-foreground flex items-center gap-2 leading-none">
      January - June 2024
    </div>
  </CardFooter>
</Card>
