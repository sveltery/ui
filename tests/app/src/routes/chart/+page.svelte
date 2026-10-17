<script lang="ts">
  import { Bar, BarChart, XAxis, type LegendContentProps, type SvelteArgs } from '@sveltery/recharts';
  import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
    type ChartTooltipContentProps,
    type TooltipContentArgs
  } from '$registry/bases/base/ui/chart';

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

  const twoMonths = months.slice(0, 2);
  type Case = { id: string; data: Record<string, unknown>[]; keys?: string[]; config?: ChartConfig; tooltip?: Partial<ChartTooltipContentProps> };
  const cases: Case[] = [
    { id: 'gaps', data: [{ month: 'January', desktop: 186, mobile: null }, months[1]] },
    { id: 'formatted', data: twoMonths, tooltip: { labelFormatter: () => 0 } },
    { id: 'valued', data: twoMonths, tooltip: { formatter: valueOnly } },
    { id: 'unlisted', data: twoMonths.map((row) => ({ ...row, tablet: 50 })), keys: ['desktop', 'tablet'] },
    { id: 'plain', data: twoMonths, config: { desktop: { label: 'Desktop' }, mobile: { label: 'Mobile' } } }
  ];
</script>

{#snippet valueOnly(value: unknown, name: unknown)}
  {name}={value}
{/snippet}

<div id="wrapper" style="width: 600px">
  <ChartContainer id="bars" config={monthsConfig}>
    <BarChart accessibilityLayer data={months}>
      <XAxis dataKey="month" />
      <ChartTooltip>
        {#snippet content(props: TooltipContentArgs)}
          <ChartTooltipContent indicator="dashed" {...props} />
        {/snippet}
      </ChartTooltip>
      <ChartLegend>
        {#snippet content(props: SvelteArgs<LegendContentProps>)}
          <ChartLegendContent {...props} />
        {/snippet}
      </ChartLegend>
      <Bar dataKey="desktop" fill="var(--color-desktop)" />
      <Bar dataKey="mobile" fill="var(--color-mobile)" />
    </BarChart>
  </ChartContainer>
</div>

{#each cases as c (c.id)}
  <div style="width: 400px">
    <ChartContainer id={c.id} config={c.config ?? monthsConfig}>
      <BarChart data={c.data}>
        <XAxis dataKey="month" />
        <ChartTooltip>
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent {...props} {...c.tooltip} />
          {/snippet}
        </ChartTooltip>
        <ChartLegend>
          {#snippet content(props: SvelteArgs<LegendContentProps>)}
            <ChartLegendContent {...props} />
          {/snippet}
        </ChartLegend>
        {#each c.keys ?? ['desktop', 'mobile'] as key (key)}
          <Bar dataKey={key} fill="var(--color-{key})" />
        {/each}
      </BarChart>
    </ChartContainer>
  </div>
{/each}
