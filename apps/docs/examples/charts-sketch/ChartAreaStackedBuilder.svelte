<script lang="ts">
  import { ChartContainer, ChartTooltipContent, type ChartConfig } from '$registry/bases/base/ui/chart';
  import { cartesianChart } from './builder';

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]

  const chartConfig = {
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
  } satisfies ChartConfig

  const definition = cartesianChart(chartConfig, { data: chartData, x: "month", series: ["mobile", "desktop"], mark: "area", stacked: true, curve: "natural", format: (value) => value.slice(0, 3) })
</script>

<ChartContainer config={chartConfig} {definition} ariaLabel="Area Chart - Stacked">
  {#snippet tooltip(props)}
    <ChartTooltipContent indicator="dot" {...props} />
  {/snippet}
</ChartContainer>
