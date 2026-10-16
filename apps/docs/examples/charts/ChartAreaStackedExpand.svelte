<script lang="ts">
  import { AreaChart } from 'layerchart';
  import { curveNatural } from 'd3-shape';
  import { scaleUtc } from 'd3-scale';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/components/chart';
  import { IconPlaceholder } from '@sveltery/components/icons';

  const chartData = [
    { date: new Date('2024-01-01'), desktop: 186, mobile: 80, other: 45 },
    { date: new Date('2024-02-01'), desktop: 305, mobile: 200, other: 100 },
    { date: new Date('2024-03-01'), desktop: 237, mobile: 120, other: 150 },
    { date: new Date('2024-04-01'), desktop: 73, mobile: 190, other: 50 },
    { date: new Date('2024-05-01'), desktop: 209, mobile: 130, other: 100 },
    { date: new Date('2024-06-01'), desktop: 214, mobile: 140, other: 160 },
  ];

  const chartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
    other: { label: 'Other', color: 'var(--chart-3)' },
  } satisfies ChartConfig;
</script>

<Card class="w-full max-w-md">
  <CardHeader>
    <CardTitle>Area Chart - Stacked Expanded</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer aria-label="Area Chart - Stacked Expanded" config={chartConfig}>
      <AreaChart
        data={chartData}
        x="date"
        xScale={scaleUtc()}
        seriesLayout="stackExpand"
        axis="x"
        series={[
          {
            key: 'other',
            label: 'Other',
            color: 'var(--color-other)',
            props: { opacity: 0.1 },
          },
          {
            key: 'mobile',
            label: 'Mobile',
            color: 'var(--color-mobile)',
          },
          {
            key: 'desktop',
            label: 'Desktop',
            color: 'var(--color-desktop)',
          },
        ]}
        props={{
          area: {
            curve: curveNatural,
            'fill-opacity': 0.4,
            line: { class: 'stroke-1' },
            motion: 'tween',
          },
          xAxis: {
            format: (v: Date) => v.toLocaleDateString('en-US', { month: 'short' }),
          },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip
            labelFormatter={(v: Date) => {
              return v.toLocaleDateString('en-US', {
                month: 'long',
              });
            }}
            indicator="line"
          />
        {/snippet}
      </AreaChart>
    </ChartContainer>
  </CardContent>
  <CardFooter>
    <div class="flex w-full items-start gap-2 text-sm">
      <div class="grid gap-2">
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
      </div>
    </div>
  </CardFooter>
</Card>
