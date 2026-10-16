<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { type ChartConfig, ChartContainer } from '@sveltery/components/chart';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { ArcChart, Text } from 'layerchart';

  const chartData = [{ browser: 'safari', visitors: 200, color: 'var(--color-safari)' }];

  const chartConfig = {
    visitors: { label: 'Visitors' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
  } satisfies ChartConfig;
</script>

<Card class="w-full max-w-md">
  <CardHeader class="items-center">
    <CardTitle>Radial Chart - Text</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent class="flex-1">
    <ChartContainer aria-label="Radial Chart - Text" config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <ArcChart
        label="browser"
        value="visitors"
        outerRadius={-20}
        innerRadius={-12}
        padding={40}
        range={[90, -270]}
        maxValue={300}
        cornerRadius={20}
        series={chartData.map((d) => ({
          key: d.browser,
          color: d.color,
          data: [d],
        }))}
        props={{
          arc: { track: { fill: 'var(--muted)' }, motion: 'tween' },
          tooltip: { context: { hideDelay: 350 } },
        }}
        tooltipContext={false}
      >
        {#snippet belowMarks()}
          <circle cx="0" cy="0" r="60" class="fill-background" />
        {/snippet}

        {#snippet aboveMarks()}
          <Text
            value={String(chartData[0].visitors)}
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-foreground text-4xl! font-bold"
            dy={3}
          />
          <Text
            value="Visitors"
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-muted-foreground!"
            dy={22}
          />
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
