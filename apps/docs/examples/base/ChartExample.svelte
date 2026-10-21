<script lang="ts">
  import { Area, AreaChart, Bar, BarChart, CartesianGrid, Label, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, RadialBar, RadialBarChart, XAxis, type SvelteArgs, type LabelContentProps } from '@sveltery/charts';
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, type TooltipContentArgs } from '$registry/bases/base/ui/chart-legacy';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const areaChartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ]

  const areaChartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  const barChartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]

  const barChartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const lineChartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]

  const lineChartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const pieChartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 190, fill: "var(--color-other)" },
  ]

  const pieChartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "var(--chart-1)",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
    firefox: {
      label: "Firefox",
      color: "var(--chart-3)",
    },
    edge: {
      label: "Edge",
      color: "var(--chart-4)",
    },
    other: {
      label: "Other",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  const radarChartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]

  const radarChartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const radialChartData = [
    { browser: "safari", visitors: 1260, fill: "var(--color-safari)" },
  ]

  const radialChartConfig = {
    visitors: {
      label: "Visitors",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig
</script>

{#snippet ChartAreaExample()}
  <Example title="Area Chart">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>Showing total visitors for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={areaChartConfig}>
          <AreaChart
            accessibilityLayer
            data={areaChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip cursor={false}>
              {#snippet content(props: TooltipContentArgs)}
                <ChartTooltipContent indicator="line" {...props} />
              {/snippet}
            </ChartTooltip>
            <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div class="flex w-full items-start gap-2">
          <div class="grid gap-2">
            <div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month <IconPlaceholder
                lucide="TrendingUpIcon"
                tabler="IconTrendingUp"
                hugeicons="ChartUpIcon"
                phosphor="TrendUpIcon"
                remixicon="RiLineChartLine"
                class="size-4"
              /></div>
            <div class="flex items-center gap-2 leading-none text-muted-foreground">January - June 2024</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  </Example>
{/snippet}

{#snippet ChartBarExample()}
  <Example title="Bar Chart">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={barChartConfig}>
          <BarChart accessibilityLayer data={barChartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip cursor={false}>
              {#snippet content(props: TooltipContentArgs)}
                <ChartTooltipContent indicator="dashed" {...props} />
              {/snippet}
            </ChartTooltip>
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col items-start gap-2">
        <div class="flex gap-2 leading-none font-medium">Trending up by 5.2% this month <IconPlaceholder
            lucide="TrendingUpIcon"
            tabler="IconTrendingUp"
            hugeicons="ChartUpIcon"
            phosphor="TrendUpIcon"
            remixicon="RiLineChartLine"
            class="size-4"
          /></div>
        <div class="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter>
    </Card>
  </Example>
{/snippet}

{#snippet ChartLineExample()}
  <Example title="Line Chart">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={lineChartConfig}>
          <LineChart
            accessibilityLayer
            data={lineChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip cursor={false}>
              {#snippet content(props: TooltipContentArgs)}
                <ChartTooltipContent {...props} />
              {/snippet}
            </ChartTooltip>
            <Line dataKey="desktop" type="monotone" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
            <Line dataKey="mobile" type="monotone" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div class="flex w-full items-start gap-2">
          <div class="grid gap-2">
            <div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month <IconPlaceholder
                lucide="TrendingUpIcon"
                tabler="IconTrendingUp"
                hugeicons="ChartUpIcon"
                phosphor="TrendUpIcon"
                remixicon="RiLineChartLine"
                class="size-4"
              /></div>
            <div class="flex items-center gap-2 leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  </Example>
{/snippet}

{#snippet ChartPieExample()}
  {const totalVisitors = $derived.by(() => {
    return pieChartData.reduce((acc, curr) => acc + curr.visitors, 0)
  })}<Example title="Pie Chart">
    <Card class="w-full">
      <CardHeader class="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent class="flex-1 pb-0">
        <ChartContainer config={pieChartConfig} class="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false}>
              {#snippet content(props: TooltipContentArgs)}
                <ChartTooltipContent hideLabel {...props} />
              {/snippet}
            </ChartTooltip>
            <Pie data={pieChartData} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
              <Label>
                {#snippet content({ viewBox }: SvelteArgs<LabelContentProps>)}
                  {#if viewBox && "cx" in viewBox && "cy" in viewBox}<text x={viewBox.cx} y={viewBox.cy} text-anchor="middle" dominant-baseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} class="fill-foreground text-3xl font-bold">{totalVisitors.toLocaleString()}</tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} class="fill-muted-foreground">Visitors</tspan>
                  </text>{/if}
                {/snippet}
              </Label>
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col gap-2">
        <div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month <IconPlaceholder
            lucide="TrendingUpIcon"
            tabler="IconTrendingUp"
            hugeicons="ChartUpIcon"
            phosphor="TrendUpIcon"
            remixicon="RiLineChartLine"
            class="size-4"
          /></div>
        <div class="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter>
    </Card>
  </Example>
{/snippet}

{#snippet ChartRadarExample()}
  <Example title="Radar Chart">
    <Card class="w-full">
      <CardHeader class="items-center pb-4">
        <CardTitle>Radar Chart - Multiple</CardTitle>
        <CardDescription>Showing total visitors for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent class="pb-0">
        <ChartContainer config={radarChartConfig} class="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={radarChartData}>
            <ChartTooltip cursor={false}>
              {#snippet content(props: TooltipContentArgs)}
                <ChartTooltipContent indicator="line" {...props} />
              {/snippet}
            </ChartTooltip>
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.6} />
            <Radar dataKey="mobile" fill="var(--color-mobile)" />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col gap-2">
        <div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month <IconPlaceholder
            lucide="TrendingUpIcon"
            tabler="IconTrendingUp"
            hugeicons="ChartUpIcon"
            phosphor="TrendUpIcon"
            remixicon="RiLineChartLine"
            class="size-4"
          /></div>
        <div class="flex items-center gap-2 leading-none text-muted-foreground">January - June 2024</div>
      </CardFooter>
    </Card>
  </Example>
{/snippet}

{#snippet ChartRadialExample()}
  <Example title="Radial Chart">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Radial Chart - Shape</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent class="flex-1 pb-0">
        <ChartContainer config={radialChartConfig} class="mx-auto aspect-square max-h-[210px]">
          <RadialBarChart data={radialChartData} endAngle={100} innerRadius={64} outerRadius={94}>
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              class="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label>
                {#snippet content({ viewBox }: SvelteArgs<LabelContentProps>)}
                  {#if viewBox && "cx" in viewBox && "cy" in viewBox}<text x={viewBox.cx} y={viewBox.cy} text-anchor="middle" dominant-baseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} class="fill-foreground text-4xl font-bold">{radialChartData[0].visitors.toLocaleString()}</tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} class="fill-muted-foreground">Visitors</tspan>
                  </text>{/if}
                {/snippet}
              </Label>
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col gap-2">
        <div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month <IconPlaceholder
            lucide="TrendingUpIcon"
            tabler="IconTrendingUp"
            hugeicons="ChartUpIcon"
            phosphor="TrendUpIcon"
            remixicon="RiLineChartLine"
            class="size-4"
          /></div>
        <div class="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter>
    </Card>
  </Example>
{/snippet}

<ExampleWrapper>{@render ChartAreaExample()}{@render ChartBarExample()}{@render ChartLineExample()}{@render ChartPieExample()}{@render ChartRadialExample()}{@render ChartRadarExample()}</ExampleWrapper>
