<script lang="ts">
  import { BarChart } from 'layerchart';
  import { type ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from '$registry/bases/base/ui/chart';

  const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: { label: 'Desktop', color: '#2563eb' },
    mobile: { label: 'Mobile', color: '#60a5fa' },
  } satisfies ChartConfig;
</script>

<ChartContainer config={chartConfig} class="h-[200px] w-full" aria-label="Desktop and mobile visitors by month">
  <BarChart
    data={chartData}
    x="month"
    seriesLayout="group"
    series={[
      { key: 'desktop', color: 'var(--color-desktop)' },
      { key: 'mobile', color: 'var(--color-mobile)' },
    ]}
    axis="x"
    props={{ xAxis: { tickLength: 16, format: (value: string) => value.slice(0, 3) } }}
    rule={false}
  >
    {#snippet tooltip()}
      <ChartTooltip />
    {/snippet}
    {#snippet legend()}
      <ChartLegend />
    {/snippet}
  </BarChart>
</ChartContainer>
