<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from './layerchart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { PieChart, Text } from 'layerchart';

  const chartData = [
    { browser: 'chrome', visitors: 275, color: 'var(--color-chrome)' },
    { browser: 'safari', visitors: 200, color: 'var(--color-safari)' },
    { browser: 'firefox', visitors: 287, color: 'var(--color-firefox)' },
    { browser: 'edge', visitors: 173, color: 'var(--color-edge)' },
    { browser: 'other', visitors: 190, color: 'var(--color-other)' },
  ];

  const chartConfig = {
    visitors: { label: 'Visitors' },
    chrome: { label: 'Chrome', color: 'var(--chart-1)' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
    firefox: { label: 'Firefox', color: 'var(--chart-3)' },
    edge: { label: 'Edge', color: 'var(--chart-4)' },
    other: { label: 'Other', color: 'var(--chart-5)' },
  } satisfies ChartConfig;

  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0);
</script>

<Card class="flex flex-col w-full max-w-md">
  <CardHeader class="items-center">
    <CardTitle>Pie Chart - Donut with Text</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent class="flex-1">
    <ChartContainer aria-label="Pie Chart - Donut with Text" config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <PieChart
        data={chartData}
        key="browser"
        value="visitors"
        c="color"
        innerRadius={60}
        padding={28}
        props={{ pie: { motion: 'tween' } }}
      >
        {#snippet aboveMarks()}
          <Text
            value={String(totalVisitors)}
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-foreground text-3xl! font-bold"
            dy={3}
          />
          <Text
            value="Visitors"
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-muted-foreground! text-muted-foreground"
            dy={22}
          />
        {/snippet}
        {#snippet tooltip()}
          <ChartTooltip hideLabel nameKey="browser" />
        {/snippet}
      </PieChart>
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
    <div class="text-muted-foreground leading-none">
      Showing total visitors for the last 6 months
    </div>
  </CardFooter>
</Card>
