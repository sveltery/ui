<script lang="ts">
  import { PieChart, Text } from 'layerchart';
  import { Badge } from '@sveltery/components/badge';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { type ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from '@sveltery/components/chart';
  import { Progress } from '@sveltery/components/progress';

  const pieChartData = [
    { browser: 'chrome', visitors: 275, color: 'var(--color-chrome)' },
    { browser: 'safari', visitors: 200, color: 'var(--color-safari)' },
    { browser: 'firefox', visitors: 287, color: 'var(--color-firefox)' },
    { browser: 'edge', visitors: 173, color: 'var(--color-edge)' }
  ];

  const pieChartConfig = {
    visitors: {
      label: 'Visitors'
    },
    chrome: {
      label: 'Chrome',
      color: 'var(--chart-1)'
    },
    safari: {
      label: 'Safari',
      color: 'var(--chart-2)'
    },
    firefox: {
      label: 'Firefox',
      color: 'var(--chart-3)'
    },
    edge: {
      label: 'Edge',
      color: 'var(--chart-4)'
    }
  } satisfies ChartConfig;

  const totalVisitors = pieChartData.reduce((sum, item) => sum + item.visitors, 0);
  const topBrowser = pieChartData.reduce((max, item) => (item.visitors > max.visitors ? item : max));
  const topBrowserShare = Math.round((topBrowser.visitors / totalVisitors) * 100);
  const topBrowserLabel = pieChartConfig[topBrowser.browser as keyof typeof pieChartConfig]?.label ?? 'Top';
</script>

<Card>
  <CardHeader class="pb-0">
    <CardTitle>Browser Share</CardTitle>
    <CardDescription>January - June 2026</CardDescription>
    <CardAction>
      <Badge variant="outline">{topBrowserLabel}</Badge>
    </CardAction>
  </CardHeader>
  <CardContent class="pt-0">
    <ChartContainer aria-label="Browser share" config={pieChartConfig} class="mx-auto aspect-square max-h-[190px]">
      <PieChart
        data={pieChartData}
        key="browser"
        value="visitors"
        c="color"
        innerRadius={50}
        padding={{ top: 4, bottom: 28, left: 4, right: 4 }}
        props={{ pie: { motion: 'tween' } }}
      >
        {#snippet aboveMarks()}
          <Text
            value={totalVisitors.toLocaleString()}
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-foreground text-2xl! font-bold"
            dy={-8}
          />
          <Text
            value="Visitors"
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-muted-foreground! text-xs text-muted-foreground"
            dy={12}
          />
        {/snippet}
        {#snippet tooltip()}
          <ChartTooltip hideLabel nameKey="browser" />
        {/snippet}
        {#snippet legend()}
          <ChartLegend nameKey="browser" />
        {/snippet}
      </PieChart>
    </ChartContainer>
  </CardContent>
  <CardFooter class="flex-col items-stretch gap-2">
    <div class="flex items-center text-xs">
      <span class="font-medium">{topBrowserLabel}</span>
      <span class="ml-auto text-muted-foreground tabular-nums">{topBrowserShare}%</span>
    </div>
    <Progress value={topBrowserShare} class="**:data-[slot=progress-indicator]:bg-chart-3" />
  </CardFooter>
</Card>
