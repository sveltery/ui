<script lang="ts">
  import { ArcChart, BarChart, PieChart } from 'layerchart';
  import { ChartContainer, ChartLegend, ChartTooltip, type ChartConfig, type ChartTooltipFormatterArgs, type ChartTooltipProps } from '@sveltery/ui/chart';

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

  const twoMonths = months.slice(0, 2);
  const series = [
    { key: 'desktop', label: 'Desktop' },
    { key: 'mobile', label: 'Mobile' }
  ];
  type Case = { id: string; style?: string; data: Record<string, unknown>[]; x?: string; series?: { key: string; label?: string }[]; config?: ChartConfig; tooltip?: ChartTooltipProps };
  const cases: Case[] = [
    { id: 'gaps', data: [{ month: 'January', desktop: 186, mobile: null }, months[1]] },
    { id: 'zero', data: [{ day: 0, desktop: 186, mobile: 80 }, { day: 1, desktop: 305, mobile: 200 }], x: 'day' },
    { id: 'dates', data: twoMonths.map((row, index) => ({ ...row, date: new Date(Date.UTC(2024, index, 1)) })), x: 'date' },
    { id: 'formatted', data: twoMonths, tooltip: { labelFormatter: () => 0 } },
    { id: 'unnamed', data: twoMonths, series: [{ key: 'desktop', label: '' }, series[1]], tooltip: { formatter: valueOnly } },
    { id: 'unlisted', data: twoMonths.map((row) => ({ ...row, tablet: 50 })), series: [series[0], { key: 'tablet' }] },
    { id: 'luma', data: twoMonths, style: 'style-luma' },
    { id: 'plain', data: twoMonths, config: { desktop: { label: 'Desktop' }, mobile: { label: 'Mobile' } } }
  ];
</script>

{#snippet valueOnly({ name, value }: ChartTooltipFormatterArgs)}
  {name}={value}
{/snippet}

<div id="wrapper" style="width: 600px">
  <ChartContainer id="bars" config={monthsConfig}>
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

<div style="width: 300px">
  <ChartContainer id="radial" config={browsersConfig} class="aspect-square">
    <ArcChart
      label="browser"
      value="visitors"
      range={[90, -270]}
      maxValue={275}
      series={browsers.map((row) => ({ key: row.browser, color: `var(--color-${row.browser})`, data: [row] }))}
    >
      {#snippet tooltip()}
        <ChartTooltip hideLabel nameKey="browser" />
      {/snippet}
    </ArcChart>
  </ChartContainer>
</div>

{#each cases as c (c.id)}
  <div class={c.style} style="width: 400px">
    <ChartContainer id={c.id} config={c.config ?? monthsConfig}>
      <BarChart data={c.data} x={c.x ?? 'month'} axis="x" rule={false} seriesLayout="group" series={c.series ?? series}>
        {#snippet tooltip()}
          <ChartTooltip {...c.tooltip} />
        {/snippet}
        {#snippet legend()}
          <ChartLegend />
        {/snippet}
      </BarChart>
    </ChartContainer>
  </div>
{/each}
