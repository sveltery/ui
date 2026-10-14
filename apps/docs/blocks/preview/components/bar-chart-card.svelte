<script lang="ts">
  import { scaleBand } from 'd3-scale';
  import { BarChart } from 'layerchart';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { type ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from '@sveltery/ui/chart';

  const barChartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 }
  ];

  const barChartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'var(--chart-1)'
    },
    mobile: {
      label: 'Mobile',
      color: 'var(--chart-2)'
    }
  } satisfies ChartConfig;

  const desktopTotal = barChartData.reduce((sum, item) => sum + item.desktop, 0);
  const mobileTotal = barChartData.reduce((sum, item) => sum + item.mobile, 0);
  const desktopDelta = Math.round(((desktopTotal - mobileTotal) / mobileTotal) * 100);
  const desktopDeltaPrefix = desktopDelta > 0 ? '+' : '';
</script>

<Card>
  <CardHeader>
    <CardTitle class="text-lg">Traffic channels</CardTitle>
    <CardDescription class="line-clamp-2 text-sm leading-snug">
      Monthly desktop and mobile traffic for the last six months—compare volume and mix across platforms and devices at a glance.
    </CardDescription>
  </CardHeader>
  <CardContent class="flex flex-col gap-4 pt-0">
    <ChartContainer aria-label="Desktop and mobile traffic by month" config={barChartConfig} class="max-h-[180px] w-full">
      <BarChart
        data={barChartData}
        x="month"
        xScale={scaleBand().padding(0.25)}
        x1Scale={scaleBand().paddingInner(0.2)}
        seriesLayout="group"
        series={[
          { key: 'desktop', label: 'Desktop', color: 'var(--color-desktop)' },
          { key: 'mobile', label: 'Mobile', color: 'var(--color-mobile)' }
        ]}
        axis="x"
        yBaseline={0}
        rule={false}
        padding={{ top: 8, bottom: 48, left: 0, right: 0 }}
        props={{
          bars: { stroke: 'none', strokeWidth: 0, rounded: 'edge' },
          highlight: { area: { fill: 'none' } },
          xAxis: { format: (month: string) => month.slice(0, 3), tickLength: 0 },
          grid: { y: true, x: false, class: 'stroke-border/60 [stroke-dasharray:3_3]' }
        }}
      >
        {#snippet tooltip()}
          <ChartTooltip indicator="dashed" />
        {/snippet}
        {#snippet legend()}
          <ChartLegend />
        {/snippet}
      </BarChart>
    </ChartContainer>
    <div class="grid w-full grid-cols-3 divide-x divide-border/60">
      <div class="px-2 text-center">
        <div class="text-[0.65rem] text-muted-foreground uppercase">Desktop</div>
        <div class="text-sm font-medium tabular-nums">{desktopTotal.toLocaleString()}</div>
      </div>
      <div class="px-2 text-center">
        <div class="text-[0.65rem] text-muted-foreground uppercase">Mobile</div>
        <div class="text-sm font-medium tabular-nums">{mobileTotal.toLocaleString()}</div>
      </div>
      <div class="px-2 text-center">
        <div class="text-[0.65rem] text-muted-foreground uppercase">Mix Delta</div>
        <div class="text-sm font-medium tabular-nums">{desktopDeltaPrefix}{desktopDelta}%</div>
      </div>
    </div>
  </CardContent>
  <CardFooter>
    <Button class="w-full">View report</Button>
  </CardFooter>
</Card>
