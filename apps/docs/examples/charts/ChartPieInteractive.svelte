<script lang="ts">
  import { Label, Pie, PieChart, Sector, type PieSectorShapeProps, type SvelteArgs, type LabelContentProps } from '@sveltery/recharts';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent, type ChartConfig, type TooltipContentArgs } from '$registry/bases/base/ui/chart';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$registry/bases/base/ui/select';

  const desktopData = [
    { month: "january", desktop: 186, fill: "var(--color-january)" },
    { month: "february", desktop: 305, fill: "var(--color-february)" },
    { month: "march", desktop: 237, fill: "var(--color-march)" },
    { month: "april", desktop: 173, fill: "var(--color-april)" },
    { month: "may", desktop: 209, fill: "var(--color-may)" },
  ]

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    desktop: {
      label: "Desktop",
    },
    mobile: {
      label: "Mobile",
    },
    january: {
      label: "January",
      color: "var(--chart-1)",
    },
    february: {
      label: "February",
      color: "var(--chart-2)",
    },
    march: {
      label: "March",
      color: "var(--chart-3)",
    },
    april: {
      label: "April",
      color: "var(--chart-4)",
    },
    may: {
      label: "May",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  const id = "pie-interactive";

  let activeMonth = $state(desktopData[0].month);

  const activeIndex = $derived.by(() => desktopData.findIndex((item) => item.month === activeMonth));

  const months = $derived.by(() => desktopData.map((item) => item.month));
</script>

{#snippet renderPieShape({ index, outerRadius = 0, ...props }: SvelteArgs<PieSectorShapeProps>)}
  {#if index === activeIndex}<g>
    <Sector {...props} outerRadius={outerRadius + 10} />
    <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
  </g>{:else}<Sector {...props} {outerRadius} />{/if}
{/snippet}

<Card data-chart={id} class="flex flex-col">
  <ChartStyle {id} config={chartConfig} />
  <CardHeader class="flex-row items-start space-y-0 pb-0">
    <div class="grid gap-1">
      <CardTitle>Pie Chart - Interactive</CardTitle>
      <CardDescription>January - June 2024</CardDescription>
    </div>
    <Select value={activeMonth} onValueChange={(value) => value !== null && (activeMonth = value)}>
      <SelectTrigger class="ml-auto h-7 w-[130px] rounded-lg pl-2.5" aria-label="Select a value">
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent align="end" class="rounded-xl">
        {#each months as key (key)}
          {const config = $derived(chartConfig[key as keyof typeof chartConfig])}{#if !(!config)}<SelectItem value={key} class="rounded-lg [&_span]:flex">
            <div class="flex items-center gap-2 text-xs"><span class="flex h-3 w-3 shrink-0 rounded-xs" style:background-color={`var(--color-${key})`}></span>{config?.label}</div>
          </SelectItem>{/if}
        {/each}
      </SelectContent>
    </Select>
  </CardHeader>
  <CardContent class="flex flex-1 justify-center pb-0">
    <ChartContainer {id} config={chartConfig} class="mx-auto aspect-square w-full max-w-[300px]">
      <PieChart>
        <ChartTooltip cursor={false}>
          {#snippet content(props: TooltipContentArgs)}
            <ChartTooltipContent hideLabel {...props} />
          {/snippet}
        </ChartTooltip>
        <Pie data={desktopData} dataKey="desktop" nameKey="month" innerRadius={60} strokeWidth={5} shape={renderPieShape}>
          <Label>
            {#snippet content({ viewBox }: SvelteArgs<LabelContentProps>)}
              {#if viewBox && "cx" in viewBox && "cy" in viewBox}<text x={viewBox.cx} y={viewBox.cy} text-anchor="middle" dominant-baseline="middle">
                <tspan x={viewBox.cx} y={viewBox.cy} class="fill-foreground text-3xl font-bold">{desktopData[activeIndex].desktop.toLocaleString()}</tspan>
                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} class="fill-muted-foreground">Visitors</tspan>
              </text>{/if}
            {/snippet}
          </Label>
        </Pie>
      </PieChart>
    </ChartContainer>
  </CardContent>
</Card>
