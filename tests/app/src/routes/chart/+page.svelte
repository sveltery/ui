<script lang="ts">
  import { BarChart, PieChart } from 'layerchart';
  import { ChartContainer, ChartLegend, ChartTooltip, type ChartConfig } from '@sveltery/ui/chart';

  const months = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 }
  ];
  const monthsConfig = {
    desktop: { label: 'Desktop', color: 'rgb(37, 99, 235)' },
    mobile: { label: 'Mobile', theme: { light: 'rgb(220, 38, 38)', dark: 'rgb(250, 204, 21)' } }
  } satisfies ChartConfig;

  const browsers = [
    { browser: 'chrome', visitors: 275 },
    { browser: 'safari', visitors: 200 },
    { browser: 'firefox', visitors: 187 }
  ];
  const browsersConfig = {
    chrome: { label: 'Chrome', color: 'rgb(34, 197, 94)' },
    safari: { label: 'Safari', color: 'rgb(168, 85, 247)' },
    firefox: { label: 'Firefox', color: 'rgb(249, 115, 22)' }
  } satisfies ChartConfig;
</script>

<div id="wrapper" style="width: 600px">
  <ChartContainer id="bars" config={monthsConfig} aria-label="Visitors by month">
    <BarChart
      data={months}
      x="month"
      axis="x"
      rule={false}
      seriesLayout="group"
      series={[
        { key: 'desktop', label: 'Desktop', color: 'var(--color-desktop)' },
        { key: 'mobile', label: 'Mobile', color: 'var(--color-mobile)' }
      ]}
    >
      {#snippet tooltip()}
        <ChartTooltip indicator="dashed" />
      {/snippet}
      {#snippet legend()}
        <ChartLegend />
      {/snippet}
    </BarChart>
  </ChartContainer>
</div>

<div style="width: 300px">
  <ChartContainer id="pie" config={browsersConfig} class="aspect-square">
    <PieChart
      data={browsers.map((row) => ({ ...row, color: `var(--color-${row.browser})` }))}
      key="browser"
      value="visitors"
      c="color"
      padding={{ bottom: 32 }}
    >
      {#snippet tooltip()}
        <ChartTooltip hideLabel nameKey="browser" />
      {/snippet}
      {#snippet legend()}
        <ChartLegend nameKey="browser" />
      {/snippet}
    </PieChart>
  </ChartContainer>
</div>
