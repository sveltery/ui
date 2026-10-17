<script lang="ts">
  import { Arc, PieChart, Text } from 'layerchart';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from './layerchart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const chartData = [
    { browser: 'chrome', visitors: 275, color: 'var(--color-chrome)' },
    { browser: 'safari', visitors: 200, color: 'var(--color-safari)' },
    { browser: 'firefox', visitors: 187, color: 'var(--color-firefox)' },
    { browser: 'edge', visitors: 173, color: 'var(--color-edge)' },
    { browser: 'other', visitors: 90, color: 'var(--color-other)' },
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

<Card class="flex flex-col w-full max-w-md">
  <CardHeader class="items-center">
    <CardTitle>Pie Chart - Label</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent class="flex-1">
    <ChartContainer aria-label="Pie Chart - Label" config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <PieChart
        data={chartData}
        key="browser"
        value="visitors"
        cRange={chartData.map((d) => d.color)}
        c="color"
        props={{
          pie: {
            motion: 'tween',
          },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip hideLabel nameKey="browser" />
        {/snippet}
        {#snippet arc({ props, visibleData, index })}
          {const browser = visibleData[index].browser}
          <Arc {...props}>
            {#snippet children({ getArcTextProps })}
              <Text
                value={browser}
                {...getArcTextProps('centroid')}
                font-size="12"
                class="fill-background capitalize"
              />
            {/snippet}
          </Arc>
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
