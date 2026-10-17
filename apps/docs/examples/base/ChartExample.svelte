<script lang="ts">
  import { scaleBand, scaleUtc } from 'd3-scale';
  import { curveLinearClosed, curveNatural } from 'd3-shape';
  import { cubicInOut } from 'svelte/easing';
  import { AreaChart, ArcChart, BarChart, LineChart, PieChart, Text, type ChartContextValue } from 'layerchart';
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { type ChartConfig, ChartContainer, ChartTooltip } from '$registry/bases/base/ui/chart';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const monthly = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];
  const dated = monthly.map((row, index) => ({ ...row, date: new Date(Date.UTC(2024, index, 1)) }));
  const shortMonth = (value: Date) => value.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
  const longMonth = (value: Date) => value.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });

  const visitorsConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  } satisfies ChartConfig;

  const deviceConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  } satisfies ChartConfig;

  const pieData = [
    { browser: 'chrome', visitors: 275, color: 'var(--color-chrome)' },
    { browser: 'safari', visitors: 200, color: 'var(--color-safari)' },
    { browser: 'firefox', visitors: 287, color: 'var(--color-firefox)' },
    { browser: 'edge', visitors: 173, color: 'var(--color-edge)' },
    { browser: 'other', visitors: 190, color: 'var(--color-other)' },
  ];
  const pieConfig = {
    visitors: { label: 'Visitors' },
    chrome: { label: 'Chrome', color: 'var(--chart-1)' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
    firefox: { label: 'Firefox', color: 'var(--chart-3)' },
    edge: { label: 'Edge', color: 'var(--chart-4)' },
    other: { label: 'Other', color: 'var(--chart-5)' },
  } satisfies ChartConfig;
  const totalVisitors = pieData.reduce((total, row) => total + row.visitors, 0);

  const radialData = [{ browser: 'safari', visitors: 1260, color: 'var(--color-safari)' }];
  const radialConfig = {
    visitors: { label: 'Visitors' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
  } satisfies ChartConfig;

  let barContext = $state<ChartContextValue>();
</script>

{#snippet trend(detail: string)}
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
  <div class="flex items-center gap-2 leading-none text-muted-foreground">{detail}</div>
{/snippet}

{#snippet ChartAreaExample()}
  <Example title="Area Chart">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>Showing total visitors for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer aria-label="Area Chart" config={visitorsConfig}>
          <AreaChart
            data={dated}
            x="date"
            xScale={scaleUtc()}
            series={[{ key: 'desktop', label: 'Desktop', color: 'var(--color-desktop)' }]}
            axis="x"
            props={{
              area: { curve: curveNatural, 'fill-opacity': 0.4, line: { class: 'stroke-1' }, motion: 'tween' },
              xAxis: { tickLength: 14, format: shortMonth },
            }}
          >
            {#snippet tooltip()}
              <ChartTooltip labelFormatter={longMonth} indicator="line" />
            {/snippet}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div class="grid gap-2 text-sm">{@render trend('January - June 2024')}</div>
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
        <ChartContainer aria-label="Bar Chart - Multiple" config={deviceConfig}>
          <BarChart
            bind:context={barContext}
            data={monthly}
            xScale={scaleBand().padding(0.25)}
            x="month"
            axis="x"
            series={[
              { key: 'desktop', label: 'Desktop', color: 'var(--color-desktop)' },
              { key: 'mobile', label: 'Mobile', color: 'var(--color-mobile)' },
            ]}
            x1Scale={scaleBand().paddingInner(0.2)}
            seriesLayout="group"
            rule={false}
            props={{
              bars: {
                stroke: 'none',
                strokeWidth: 0,
                rounded: 'all',
                initialY: barContext?.height,
                initialHeight: 0,
                motion: {
                  y: { type: 'tween', duration: 500, easing: cubicInOut },
                  height: { type: 'tween', duration: 500, easing: cubicInOut },
                },
              },
              highlight: { area: { fill: 'none' } },
              xAxis: { tickLength: 16, format: (month: string) => month.slice(0, 3) },
            }}
          >
            {#snippet tooltip()}
              <ChartTooltip indicator="dashed" />
            {/snippet}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col items-start gap-2 text-sm">
        {@render trend('Showing total visitors for the last 6 months')}
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
        <ChartContainer aria-label="Line Chart - Multiple" config={deviceConfig}>
          <LineChart
            data={dated}
            x="date"
            xScale={scaleUtc()}
            axis="x"
            series={[
              { key: 'desktop', label: 'Desktop', color: 'var(--color-desktop)' },
              { key: 'mobile', label: 'Mobile', color: 'var(--color-mobile)' },
            ]}
            props={{
              spline: { curve: curveNatural, motion: 'tween', strokeWidth: 2 },
              xAxis: { tickLength: 14, format: shortMonth },
              highlight: { points: { r: 4 } },
            }}
          >
            {#snippet tooltip()}
              <ChartTooltip labelFormatter={longMonth} />
            {/snippet}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div class="grid gap-2 text-sm">{@render trend('Showing total visitors for the last 6 months')}</div>
      </CardFooter>
    </Card>
  </Example>
{/snippet}

{#snippet ChartPieExample()}
  <Example title="Pie Chart">
    <Card class="w-full">
      <CardHeader class="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent class="flex-1 pb-0">
        <ChartContainer aria-label="Pie Chart - Donut with Text" config={pieConfig} class="mx-auto aspect-square max-h-[250px]">
          <PieChart
            data={pieData}
            key="browser"
            value="visitors"
            c="color"
            innerRadius={60}
            padding={28}
            props={{ pie: { motion: 'tween' } }}
          >
            {#snippet aboveMarks()}
              <Text
                value={totalVisitors.toLocaleString()}
                textAnchor="middle"
                verticalAnchor="middle"
                class="fill-foreground text-3xl! font-bold"
                dy={3}
              />
              <Text
                value="Visitors"
                textAnchor="middle"
                verticalAnchor="middle"
                class="fill-muted-foreground! text-muted-foreground"
                dy={22}
              />
            {/snippet}
            {#snippet tooltip()}
              <ChartTooltip hideLabel nameKey="browser" />
            {/snippet}
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col gap-2 text-sm">
        {@render trend('Showing total visitors for the last 6 months')}
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
        <ChartContainer aria-label="Radial Chart - Shape" config={radialConfig} class="mx-auto aspect-square max-h-[250px]">
          <ArcChart
            label="browser"
            value="visitors"
            outerRadius={88}
            innerRadius={66}
            trackOuterRadius={83}
            trackInnerRadius={72}
            padding={40}
            range={[90, -270]}
            maxValue={radialData[0].visitors * 4}
            series={radialData.map((row) => ({ key: row.browser, color: row.color, data: [row] }))}
            props={{
              arc: { track: { fill: 'var(--muted)' }, motion: 'tween' },
              tooltip: { context: { hideDelay: 350 } },
            }}
            tooltipContext={false}
          >
            {#snippet belowMarks()}
              <circle cx="0" cy="0" r="80" class="fill-background" />
            {/snippet}
            {#snippet aboveMarks()}
              <Text
                value={radialData[0].visitors.toLocaleString()}
                textAnchor="middle"
                verticalAnchor="middle"
                class="fill-foreground text-4xl! font-bold"
                dy={3}
              />
              <Text value="Visitors" textAnchor="middle" verticalAnchor="middle" class="fill-muted-foreground!" dy={22} />
            {/snippet}
          </ArcChart>
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col gap-2 text-sm">
        {@render trend('Showing total visitors for the last 6 months')}
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
        <ChartContainer aria-label="Radar Chart - Multiple" config={deviceConfig} class="mx-auto aspect-square max-h-[250px]">
          <LineChart
            data={monthly}
            series={[
              {
                key: 'desktop',
                label: 'Desktop',
                color: 'var(--color-desktop)',
                props: { fill: 'var(--color-desktop)', fillOpacity: 0.6 },
              },
              {
                key: 'mobile',
                label: 'Mobile',
                color: 'var(--color-mobile)',
                props: { fill: 'var(--color-mobile)' },
              },
            ]}
            radial
            x="month"
            xScale={scaleBand()}
            padding={12}
            props={{
              spline: { curve: curveLinearClosed, stroke: '0', motion: 'tween' },
              xAxis: { tickLength: 0 },
              yAxis: { format: () => '' },
              grid: { radialY: 'linear' },
              tooltip: { context: { mode: 'band' } },
              highlight: { lines: false, points: { r: 4 } },
            }}
          >
            {#snippet tooltip()}
              <ChartTooltip indicator="line" />
            {/snippet}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter class="flex-col gap-2 text-sm">
        {@render trend('January - June 2024')}
      </CardFooter>
    </Card>
  </Example>
{/snippet}

<ExampleWrapper class="lg:grid-cols-1">
  {@render ChartAreaExample()}
  {@render ChartBarExample()}
  {@render ChartLineExample()}
  {@render ChartPieExample()}
  {@render ChartRadialExample()}
  {@render ChartRadarExample()}
</ExampleWrapper>
