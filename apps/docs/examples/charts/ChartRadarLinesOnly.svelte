<script lang="ts">
  import { LineChart } from 'layerchart';
  import { curveLinearClosed } from 'd3-shape';
  import { scaleBand } from 'd3-scale';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/ui/chart';
  import { IconPlaceholder } from '@sveltery/ui/icons';

  const chartData = [
    { month: 'January', desktop: 186, mobile: 160 },
    { month: 'February', desktop: 185, mobile: 170 },
    { month: 'March', desktop: 207, mobile: 180 },
    { month: 'April', desktop: 173, mobile: 160 },
    { month: 'May', desktop: 160, mobile: 190 },
    { month: 'June', desktop: 174, mobile: 204 },
  ];

  const chartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  } satisfies ChartConfig;
</script>

<Card class="w-full max-w-md">
  <CardHeader class="items-center">
    <CardTitle>Radar Chart - Lines Only</CardTitle>
    <CardDescription>Showing total visitors for the last 6 months</CardDescription>
  </CardHeader>
  <CardContent class="flex-1">
    <ChartContainer aria-label="Radar Chart - Lines Only" config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <LineChart
        radial
        data={chartData}
        x="month"
        xScale={scaleBand()}
        padding={12}
        series={[
          {
            key: 'desktop',
            label: 'Desktop',
            color: 'var(--color-desktop)',
            props: { class: 'fill-none stroke-[2]' },
          },
          {
            key: 'mobile',
            label: 'Mobile',
            color: 'var(--color-mobile)',
            props: { class: 'fill-none stroke-[2]' },
          },
        ]}
        props={{
          spline: { curve: curveLinearClosed, motion: 'tween' },
          grid: { radialY: 'linear', x: false },
          yAxis: { format: () => '' },
          tooltip: { context: { mode: 'voronoi' } },
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip indicator="line" />
        {/snippet}
      </LineChart>
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
