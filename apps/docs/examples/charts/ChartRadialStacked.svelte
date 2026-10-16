<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/components/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '@sveltery/components/chart';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { PieChart, Text } from 'layerchart';

  const chartData = [{ month: 'january', desktop: 1260, mobile: 570 }];

  const chartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  } satisfies ChartConfig;
</script>

<Card class="flex flex-col w-full max-w-md">
  <CardHeader class="items-center">
    <CardTitle>Radial Chart - Stacked</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>
  <CardContent class="flex-1">
    <ChartContainer aria-label="Radial Chart - Stacked" config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
      <PieChart
        data={[
          { platform: 'mobile', visitors: 570, color: 'var(--color-mobile)' },
          { platform: 'desktop', visitors: 1260, color: 'var(--color-desktop)' },
        ]}
        key="platform"
        value="visitors"
        c="color"
        innerRadius={76}
        padding={29}
        range={[-90, 90]}
        props={{ pie: { sort: null } }}
        cornerRadius={4}
      >
        {#snippet aboveMarks()}
          <Text
            value={String(chartData[0].desktop + chartData[0].mobile)}
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-foreground text-2xl! font-bold"
            dy={-24}
          />
          <Text
            value="Visitors"
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-muted-foreground! text-muted-foreground"
            dy={-4}
          />
        {/snippet}
        {#snippet tooltip()}
          <ChartTooltip hideLabel nameKey="platform" />
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
