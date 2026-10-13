<script lang="ts">
  import { PieChart } from 'layerchart';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/ui/chart';
  import { IconPlaceholder } from '@sveltery/ui/icons';

  const desktopData = [
    { month: 'january', desktop: 186, color: 'var(--color-january)' },
    { month: 'february', desktop: 305, color: 'var(--color-february)' },
    { month: 'march', desktop: 237, color: 'var(--color-march)' },
    { month: 'april', desktop: 173, color: 'var(--color-april)' },
    { month: 'may', desktop: 209, color: 'var(--color-may)' },
  ];

  const mobileData = [
    { month: 'january', mobile: 80, color: 'var(--color-january)' },
    { month: 'february', mobile: 200, color: 'var(--color-february)' },
    { month: 'march', mobile: 120, color: 'var(--color-march)' },
    { month: 'april', mobile: 190, color: 'var(--color-april)' },
    { month: 'may', mobile: 130, color: 'var(--color-may)' },
  ];

  const chartConfig = {
    desktop: { label: 'Desktop' },
    mobile: { label: 'Mobile' },
    january: { label: 'January', color: 'var(--chart-1)' },
    february: { label: 'February', color: 'var(--chart-2)' },
    march: { label: 'March', color: 'var(--chart-3)' },
    april: { label: 'April', color: 'var(--chart-4)' },
    may: { label: 'May', color: 'var(--chart-5)' },
  } satisfies ChartConfig;
</script>

<Card class="flex flex-col w-full max-w-md">
  <CardHeader class="items-center">
    <CardTitle>Pie Chart - Stacked</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent class="flex-1">
    <ChartContainer aria-label="Pie Chart - Stacked" config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <PieChart
        key="month"
        label="month"
        c="color"
        props={{
          pie: {
            sort: (a, b) => {
              const monthOrder = ['january', 'february', 'march', 'april', 'may'];
              return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
            },
            motion: 'tween',
          },
        }}
        series={[
          {
            key: 'desktop',
            data: desktopData.map((d) => ({ month: d.month, value: d.desktop, color: d.color, series: 'desktop' })),
            props: { innerRadius: -20 },
          },
          {
            key: 'mobile',
            data: mobileData.map((d) => ({ month: d.month, value: d.mobile, color: d.color, series: 'mobile' })),
            props: { outerRadius: -30 },
          },
        ]}
        padding={29}
      >
        {#snippet tooltip()}
          <ChartTooltip>
            {#snippet children({ data })}
              <div class="border-border/50 bg-background grid min-w-[8rem] gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
                <div class="font-medium">{chartConfig[data.series as keyof typeof chartConfig].label}</div>
                <div class="flex items-center gap-2">
                  <div class="h-2.5 w-1 shrink-0 rounded-[2px]" style:background={data.color as string}></div>
                  <span class="text-muted-foreground">{chartConfig[data.month as keyof typeof chartConfig].label}</span>
                  <span class="text-foreground ms-auto font-mono font-medium tabular-nums">{(data.value as number).toLocaleString()}</span>
                </div>
              </div>
            {/snippet}
          </ChartTooltip>
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
