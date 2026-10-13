---
title: Chart
description: Beautiful charts. Built using LayerChart. Copy and paste into your apps.
---

<ComponentPreview name="charts/ChartBarInteractive" class="theme-blue" hideCode />

Introducing **Charts**. A collection of chart components that you can copy and paste into your apps.

Charts are designed to look great out of the box. They work well with the other components and are fully customizable to fit your project.

## About

Charts are drawn by [LayerChart](https://layerchart.com), a Svelte charting library built on d3. The `chart` component ports shadcn/ui's `ChartConfig`, tooltip, and legend to LayerChart. `ChartContainer` turns a config into colors, and `ChartTooltip` and `ChartLegend` read the same config for labels, icons, and colors.

The examples on this page port the LayerChart charts of [shadcn-svelte](https://www.shadcn-svelte.com/charts) to the Sveltery components. They follow the charts of shadcn/ui, and the licenses are in `THIRD_PARTY_NOTICES.md`.

## Component

We designed the `chart` component with composition in mind. **You build your charts with LayerChart components and bring in `ChartContainer`, `ChartTooltip`, and `ChartLegend` only where you need them.**

```svelte showLineNumbers
<script lang="ts">
  import { BarChart } from 'layerchart';
  import { ChartContainer, ChartTooltip, type ChartConfig } from '$lib/components/ui/chart';

  const data = [
    { month: 'January', value: 186 },
    { month: 'February', value: 305 }
  ];
  const config = { value: { label: 'Visitors', color: 'var(--chart-1)' } } satisfies ChartConfig;
</script>

<ChartContainer {config} aria-label="Visitors by month">
  <BarChart {data} x="month" series={[{ key: 'value', color: 'var(--color-value)' }]}>
    {#snippet tooltip()}
      <ChartTooltip />
    {/snippet}
  </BarChart>
</ChartContainer>
```

We do not wrap LayerChart. You are not locked into an abstraction, and when LayerChart ships a new version, you follow its upgrade path to update your charts.

**The components are yours.**

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn layerchart
```

Many examples also import `d3-scale` and `d3-shape`, which LayerChart already depends on. Install them when you import from them in your own code.

### Copy the component

Copy the following files into `src/lib/components/ui/chart`.

<ComponentSource name="chart" />

### Add the colors to your CSS file

```css title="src/app.css" showLineNumbers
@layer base {
  :root {
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
  }

  .dark {
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
  }
}
```

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Your First Chart

Let's build your first chart. We'll build a bar chart, then add a grid, an axis, a tooltip, and a legend.

<Steps>

### Define your data

The following data holds the number of desktop and mobile users for each month.

<Callout>

**Note:** Your data can be in any shape. Use the `x`, `y`, and `series` props of the LayerChart component to map your data to the chart.

</Callout>

```svelte title="src/lib/components/example-chart.svelte" showLineNumbers
<script lang="ts">
  const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 }
  ];
</script>
```

### Define your chart config

The chart config holds the human-readable strings of a chart, such as labels, icons, and color tokens for theming.

```svelte title="src/lib/components/example-chart.svelte" showLineNumbers
<script lang="ts">
  import type { ChartConfig } from '$lib/components/ui/chart';

  const chartConfig = {
    desktop: { label: 'Desktop', color: '#2563eb' },
    mobile: { label: 'Mobile', color: '#60a5fa' }
  } satisfies ChartConfig;
</script>
```

### Build your chart

Build the chart with a LayerChart component inside a `ChartContainer`. Pass each series the color `var(--color-KEY)`, which `ChartContainer` defines from your config.

<Callout title="Give the chart a size">

`ChartContainer` is `aspect-video` by default. Set a height such as `h-[200px]`, or another aspect ratio, to change it.

</Callout>

```svelte title="src/lib/components/example-chart.svelte" showLineNumbers
<ChartContainer config={chartConfig} class="h-[200px] w-full" aria-label="Desktop and mobile visitors by month">
  <BarChart
    data={chartData}
    x="month"
    seriesLayout="group"
    series={[
      { key: 'desktop', color: 'var(--color-desktop)' },
      { key: 'mobile', color: 'var(--color-mobile)' }
    ]}
    axis={false}
    grid={false}
    rule={false}
    tooltipContext={false}
  />
</ChartContainer>
```

<ComponentPreview name="charts/ChartExample" hideCode />

</Steps>

### Add a Grid

A `BarChart` draws a grid by default. Remove `grid={false}` to show it.

```svelte showLineNumbers
<ChartContainer config={chartConfig} class="h-[200px] w-full" aria-label="Desktop and mobile visitors by month">
  <BarChart
    data={chartData}
    x="month"
    seriesLayout="group"
    series={[ /* ... */ ]}
    axis={false}
    rule={false}
    tooltipContext={false}
  />
</ChartContainer>
```

<ComponentPreview name="charts/ChartExampleGrid" hideCode />

### Add an Axis

To add an x-axis, set `axis="x"`. Format its labels with `props.xAxis.format`.

```svelte showLineNumbers
<ChartContainer config={chartConfig} class="h-[200px] w-full" aria-label="Desktop and mobile visitors by month">
  <BarChart
    data={chartData}
    x="month"
    seriesLayout="group"
    series={[ /* ... */ ]}
    axis="x"
    props={{ xAxis: { format: (value: string) => value.slice(0, 3) } }}
    rule={false}
    tooltipContext={false}
  />
</ChartContainer>
```

<ComponentPreview name="charts/ChartExampleAxis" hideCode />

### Add a Tooltip

So far we have only used LayerChart. The charts look right because `ChartContainer` styles LayerChart for you.

To add a tooltip, render the `ChartTooltip` component in the `tooltip` snippet of the chart, and remove `tooltipContext={false}`.

```svelte showLineNumbers
<script lang="ts">
  import { ChartContainer, ChartTooltip } from '$lib/components/ui/chart';
</script>

<ChartContainer config={chartConfig} class="h-[200px] w-full" aria-label="Desktop and mobile visitors by month">
  <BarChart
    data={chartData}
    x="month"
    seriesLayout="group"
    series={[ /* ... */ ]}
    axis="x"
    props={{ xAxis: { format: (value: string) => value.slice(0, 3) } }}
    rule={false}
  >
    {#snippet tooltip()}
      <ChartTooltip />
    {/snippet}
  </BarChart>
</ChartContainer>
```

<ComponentPreview name="charts/ChartExampleTooltip" hideCode />

Hover the chart to see the tooltip. Two components, and you have a tooltip that reads your config.

### Add a Legend

Do the same for the legend. Render the `ChartLegend` component in the `legend` snippet of the chart.

```svelte showLineNumbers
<script lang="ts">
  import { ChartContainer, ChartLegend, ChartTooltip } from '$lib/components/ui/chart';
</script>

<ChartContainer config={chartConfig} class="h-[200px] w-full" aria-label="Desktop and mobile visitors by month">
  <BarChart
    data={chartData}
    x="month"
    seriesLayout="group"
    series={[ /* ... */ ]}
    axis="x"
    props={{ xAxis: { format: (value: string) => value.slice(0, 3) } }}
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
```

<ComponentPreview name="charts/ChartExampleLegend" />

Done. You have built your first chart. What's next?

- [Themes and colors](/docs/components/chart#theming)
- [Tooltip](/docs/components/chart#tooltip)
- [Legend](/docs/components/chart#legend)

## Chart Config

The chart config is where you define the labels, icons, and colors of a chart.

It is intentionally decoupled from chart data. You can share a config and its color tokens between charts. It also works when your data or color tokens live somewhere else, or in another format.

```svelte title="src/lib/components/example-chart.svelte" showLineNumbers
<script lang="ts">
  import MonitorIcon from '@lucide/svelte/icons/monitor';
  import type { ChartConfig } from '$lib/components/ui/chart';

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      icon: MonitorIcon,
      // A color like 'hsl(220, 98%, 61%)' or 'var(--color-name)'
      color: '#2563eb'
    },
    mobile: {
      label: 'Mobile',
      // Or a theme object with 'light' and 'dark' keys
      theme: { light: '#2563eb', dark: '#dc2626' }
    }
  } satisfies ChartConfig;
</script>
```

An entry takes a `color` or a `theme`, never both. The `icon` is any Svelte component that takes no props. The tooltip and the legend show it in place of the color swatch.

In the examples on this page, each config icon is a small component that renders an `IconPlaceholder`, so the icon follows the icon library you pick. Use the icon component of your own project instead.

## Theming

Charts have built-in support for theming. Use CSS variables, which we recommend, or color values in any format, such as hex, hsl, or oklch.

### CSS variables

<Steps>

### Define your colors in your CSS file

```css title="src/app.css" showLineNumbers
@layer base {
  :root {
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
  }

  .dark {
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
  }
}
```

### Add the colors to your chart config

```ts title="src/lib/components/example-chart.svelte" showLineNumbers
const chartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' }
} satisfies ChartConfig;
```

</Steps>

### hex, hsl or oklch

You can also define your colors in the chart config. Use the color format you prefer.

```ts title="src/lib/components/example-chart.svelte" showLineNumbers
const chartConfig = {
  desktop: { label: 'Desktop', color: '#2563eb' },
  mobile: { label: 'Mobile', color: 'hsl(220, 98%, 61%)' },
  tablet: { label: 'Tablet', color: 'oklch(0.5 0.2 240)' },
  laptop: { label: 'Laptop', color: 'var(--chart-2)' }
} satisfies ChartConfig;
```

### Light and dark colors

Use `theme` to give a key one color for each mode. The `.dark` class selects the dark color.

```ts
const chartConfig = {
  desktop: { label: 'Desktop', theme: { light: '#2563eb', dark: '#60a5fa' } }
} satisfies ChartConfig;
```

### Using colors

`ChartContainer` writes a `--color-KEY` variable for each config key and scopes it to the chart. Reference the colors with `var(--color-KEY)`.

#### Series

```svelte
<BarChart series={[{ key: 'desktop', color: 'var(--color-desktop)' }]} />
```

#### Chart data

Rows that carry their own color, such as the slices of a pie, name the variable in the data.

```ts title="src/lib/components/example-chart.svelte" showLineNumbers
const chartData = [
  { browser: 'chrome', visitors: 275, color: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, color: 'var(--color-safari)' }
];
```

#### Tailwind

```svelte
<Text class="fill-(--color-desktop)" />
```

## Tooltip

A chart tooltip contains a label, a name, an indicator, and a value. You can combine these to customize the tooltip.

Turn off the label or the indicator with `hideLabel` and `hideIndicator`. Change the indicator style with `indicator`. Use `labelKey` and `nameKey` to read the label and the name from another key.

`ChartTooltip` replaces the default tooltip of a LayerChart chart. Render it in the `tooltip` snippet.

```svelte title="src/lib/components/example-chart.svelte"
<script lang="ts">
  import { ChartTooltip } from '$lib/components/ui/chart';
</script>

<BarChart {data} x="month" series={series}>
  {#snippet tooltip()}
    <ChartTooltip indicator="dashed" />
  {/snippet}
</BarChart>
```

Hover the charts in the [Tooltip](#tooltip-1) examples to compare the options.

### Props

`ChartTooltip` takes the following props, and the same props go to `ChartTooltipContent`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hideLabel` | `boolean` | `false` | Hides the label |
| `hideIndicator` | `boolean` | `false` | Hides the indicator |
| `indicator` | `'dot' \| 'line' \| 'dashed'` | `'dot'` | The indicator style |
| `label` | `string` | | The label text. A config key is replaced by its label |
| `labelKey` | `string` | | A config key, or a data field that holds one, whose label becomes the label |
| `nameKey` | `string` | | The data field that holds the config key of each row, for charts whose series key is not the config key |
| `labelFormatter` | `(value, items) => string \| number` | | Formats the label |
| `formatter` | `Snippet<[{ item, data, index, name, value }]>` | | Replaces the content of a row. `data` is the hovered data row |
| `color` | `string` | | The indicator color of every row |
| `labelClass` | `string` | | Added to the label |
| `class` | `string` | | Added to the tooltip |
| `children` | `Snippet<[{ data }]>` | | Replaces the whole tooltip |

### Colors

Colors come from the chart config. The indicator uses the color of the config key of each row.

### Custom

A pie or a radial chart has one series, and each slice is a row. Use `nameKey` to name the data field that holds the config key of the slice.

```ts showLineNumbers
const chartData = [
  { browser: 'chrome', visitors: 187, color: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, color: 'var(--color-safari)' }
];

const chartConfig = {
  visitors: { label: 'Total Visitors' },
  chrome: { label: 'Chrome', color: 'var(--chart-1)' },
  safari: { label: 'Safari', color: 'var(--chart-2)' }
} satisfies ChartConfig;
```

```svelte title="src/lib/components/example-chart.svelte"
<ChartTooltip hideLabel nameKey="browser" />
```

The tooltip names the rows Chrome and Safari. Add `labelKey="visitors"` to use Total Visitors as the label.

## Legend

Render the `ChartLegend` component in the `legend` snippet of a chart to add a legend. The snippet also reserves room below the plot in area, bar, and line charts.

```svelte title="src/lib/components/example-chart.svelte"
<script lang="ts">
  import { ChartLegend } from '$lib/components/ui/chart';
</script>

<BarChart {data} x="month" series={series}>
  {#snippet legend()}
    <ChartLegend />
  {/snippet}
</BarChart>
```

Use the `legend` snippet instead of the `legend` prop of LayerChart. Svelte reports an error when a component gets both.

Pie, radial, and radar charts do not reserve room for the snippet. Pass `padding` to the chart, for example `padding={{ bottom: 32 }}`, to keep the legend off the plot.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hideIcon` | `boolean` | `false` | Shows a color swatch even when the config has an icon |
| `nameKey` | `string` | | The data field that names each item, for charts whose items are rows (pie, radial) instead of series |
| `verticalAlign` | `'top' \| 'bottom'` | `'bottom'` | The side of the chart that holds the legend |
| `class` | `string` | | Added to the legend |
| `children` | `Snippet` | | Replaces the legend |

### Colors

Colors come from the chart config, in the order of the series.

### Custom

Use `nameKey` to name the data field that holds the config key of each item.

```ts showLineNumbers
const chartData = [
  { browser: 'chrome', visitors: 187, color: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, color: 'var(--color-safari)' }
];

const chartConfig = {
  chrome: { label: 'Chrome', color: 'var(--chart-1)' },
  safari: { label: 'Safari', color: 'var(--chart-2)' }
} satisfies ChartConfig;
```

```svelte title="src/lib/components/example-chart.svelte"
<ChartLegend nameKey="browser" />
```

The legend names the items Chrome and Safari.

## Accessibility

A LayerChart chart is an SVG, and the marks of the chart have no text alternative. Describe what the chart shows with `aria-label` on the `ChartContainer`, and give a table or text version when readers need the exact values.

A chart that has a `ChartTooltip` is reachable with the keyboard. The container becomes a focusable element with `role="application"` and `aria-roledescription="chart"`, and it steps through the rows of the chart. The tooltip hides when the chart loses focus.

| Key | Action |
| --- | --- |
| Arrow Right, Arrow Down | Show the tooltip of the next row |
| Arrow Left, Arrow Up | Show the tooltip of the previous row |
| Home, End | Show the tooltip of the first or the last row |
| Escape | Hide the tooltip |

## API reference

### ChartContainer

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `config` | `ChartConfig` | | Required. The label, icon, and color or theme of each key |
| `class` | `string` | | Added to the container. It is `aspect-video` by default |

`ChartContainer` passes every other attribute to its `div`. Give it an `aria-label`.

### ChartTooltip and ChartLegend

See the props of the [tooltip](#props) and of the [legend](#props-1).

### ChartConfig

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | The name shown in the tooltip and the legend |
| `icon` | `Component` | Shown in place of the color swatch |
| `color` | `string` | Any CSS color. Not allowed with `theme` |
| `theme` | `{ light: string; dark: string }` | A color for each mode. Not allowed with `color` |

## Area

### Area Chart

<ComponentPreview name="charts/ChartAreaDefault" class="theme-blue" />

### Area Chart - Linear

<ComponentPreview name="charts/ChartAreaLinear" class="theme-blue" />

### Area Chart - Step

<ComponentPreview name="charts/ChartAreaStep" class="theme-blue" />

### Area Chart - Legend

<ComponentPreview name="charts/ChartAreaLegend" class="theme-blue" />

### Area Chart - Stacked

<ComponentPreview name="charts/ChartAreaStacked" class="theme-blue" />

### Area Chart - Stacked Expanded

<ComponentPreview name="charts/ChartAreaStackedExpand" class="theme-blue" />

### Area Chart - Icons

<ComponentPreview name="charts/ChartAreaIcons" class="theme-blue" />

### Area Chart - Gradient

<ComponentPreview name="charts/ChartAreaGradient" class="theme-blue" />

### Area Chart - Axes

<ComponentPreview name="charts/ChartAreaAxes" class="theme-blue" />

### Area Chart - Interactive

<ComponentPreview name="charts/ChartAreaInteractive" class="theme-blue" />

## Bar

### Bar Chart

<ComponentPreview name="charts/ChartBarDefault" class="theme-blue" />

### Bar Chart - Horizontal

<ComponentPreview name="charts/ChartBarHorizontal" class="theme-blue" />

### Bar Chart - Multiple

<ComponentPreview name="charts/ChartBarMultiple" class="theme-blue" />

### Bar Chart - Label

<ComponentPreview name="charts/ChartBarLabel" class="theme-blue" />

### Bar Chart - Custom Label

<ComponentPreview name="charts/ChartBarLabelCustom" class="theme-blue" />

### Bar Chart - Mixed

<ComponentPreview name="charts/ChartBarMixed" class="theme-blue" />

### Bar Chart - Active

<ComponentPreview name="charts/ChartBarActive" class="theme-blue" />

### Bar Chart - Stacked + Legend

<ComponentPreview name="charts/ChartBarStacked" class="theme-blue" />

### Bar Chart - Negative

<ComponentPreview name="charts/ChartBarNegative" class="theme-blue" />

### Bar Chart - Interactive

<ComponentPreview name="charts/ChartBarInteractive" class="theme-blue" />

## Line

### Line Chart

<ComponentPreview name="charts/ChartLineDefault" class="theme-blue" />

### Line Chart - Linear

<ComponentPreview name="charts/ChartLineLinear" class="theme-blue" />

### Line Chart - Step

<ComponentPreview name="charts/ChartLineStep" class="theme-blue" />

### Line Chart - Multiple

<ComponentPreview name="charts/ChartLineMultiple" class="theme-blue" />

### Line Chart - Dots

<ComponentPreview name="charts/ChartLineDots" class="theme-blue" />

### Line Chart - Dots Custom

<ComponentPreview name="charts/ChartLineDotsCustom" class="theme-blue" />

### Line Chart - Dots Colors

<ComponentPreview name="charts/ChartLineDotsColors" class="theme-blue" />

### Line Chart - Label

<ComponentPreview name="charts/ChartLineLabel" class="theme-blue" />

### Line Chart - Custom Label

<ComponentPreview name="charts/ChartLineLabelCustom" class="theme-blue" />

### Line Chart - Interactive

<ComponentPreview name="charts/ChartLineInteractive" class="theme-blue" />

## Pie

### Pie Chart

<ComponentPreview name="charts/ChartPieSimple" class="theme-blue" />

### Pie Chart - Separator None

<ComponentPreview name="charts/ChartPieSeparatorNone" class="theme-blue" />

### Pie Chart - Label

<ComponentPreview name="charts/ChartPieLabel" class="theme-blue" />

### Pie Chart - Custom Label

<ComponentPreview name="charts/ChartPieLabelCustom" class="theme-blue" />

### Pie Chart - Label List

<ComponentPreview name="charts/ChartPieLabelList" class="theme-blue" />

### Pie Chart - Legend

<ComponentPreview name="charts/ChartPieLegend" class="theme-blue" />

### Pie Chart - Donut

<ComponentPreview name="charts/ChartPieDonut" class="theme-blue" />

### Pie Chart - Donut Active

<ComponentPreview name="charts/ChartPieDonutActive" class="theme-blue" />

### Pie Chart - Donut with Text

<ComponentPreview name="charts/ChartPieDonutText" class="theme-blue" />

### Pie Chart - Stacked

<ComponentPreview name="charts/ChartPieStacked" class="theme-blue" />

### Pie Chart - Interactive

<ComponentPreview name="charts/ChartPieInteractive" class="theme-blue" />

## Radar

### Radar Chart

<ComponentPreview name="charts/ChartRadarDefault" class="theme-blue" />

### Radar Chart - Dots

<ComponentPreview name="charts/ChartRadarDots" class="theme-blue" />

### Radar Chart - Lines Only

<ComponentPreview name="charts/ChartRadarLinesOnly" class="theme-blue" />

### Radar Chart - Custom Label

<ComponentPreview name="charts/ChartRadarLabelCustom" class="theme-blue" />

### Radar Chart - Radius Axis

<ComponentPreview name="charts/ChartRadarRadius" class="theme-blue" />

### Radar Chart - Grid Custom

<ComponentPreview name="charts/ChartRadarGridCustom" class="theme-blue" />

### Radar Chart - Grid Circle

<ComponentPreview name="charts/ChartRadarGridCircle" class="theme-blue" />

### Radar Chart - Grid Circle - No Lines

<ComponentPreview name="charts/ChartRadarGridCircleNoLines" class="theme-blue" />

### Radar Chart - Grid Circle Filled

<ComponentPreview name="charts/ChartRadarGridCircleFill" class="theme-blue" />

### Radar Chart - Grid Filled

<ComponentPreview name="charts/ChartRadarGridFill" class="theme-blue" />

### Radar Chart - Grid None

<ComponentPreview name="charts/ChartRadarGridNone" class="theme-blue" />

### Radar Chart - Icons

<ComponentPreview name="charts/ChartRadarIcons" class="theme-blue" />

### Radar Chart - Legend

<ComponentPreview name="charts/ChartRadarLegend" class="theme-blue" />

### Radar Chart - Multiple

<ComponentPreview name="charts/ChartRadarMultiple" class="theme-blue" />

## Radial

### Radial Chart

<ComponentPreview name="charts/ChartRadialSimple" class="theme-blue" />

### Radial Chart - Label

<ComponentPreview name="charts/ChartRadialLabel" class="theme-blue" />

### Radial Chart - Grid

<ComponentPreview name="charts/ChartRadialGrid" class="theme-blue" />

### Radial Chart - Text

<ComponentPreview name="charts/ChartRadialText" class="theme-blue" />

### Radial Chart - Shape

<ComponentPreview name="charts/ChartRadialShape" class="theme-blue" />

### Radial Chart - Stacked

<ComponentPreview name="charts/ChartRadialStacked" class="theme-blue" />

## Tooltip examples

### Tooltip - Default

<ComponentPreview name="charts/ChartTooltipDefault" class="theme-blue" />

### Tooltip - Line Indicator

<ComponentPreview name="charts/ChartTooltipIndicatorLine" class="theme-blue" />

### Tooltip - No Indicator

<ComponentPreview name="charts/ChartTooltipIndicatorNone" class="theme-blue" />

### Tooltip - Custom Label

<ComponentPreview name="charts/ChartTooltipLabelCustom" class="theme-blue" />

### Tooltip - Label Formatter

<ComponentPreview name="charts/ChartTooltipLabelFormatter" class="theme-blue" />

### Tooltip - No Label

<ComponentPreview name="charts/ChartTooltipLabelNone" class="theme-blue" />

### Tooltip - Formatter

<ComponentPreview name="charts/ChartTooltipFormatter" class="theme-blue" />

### Tooltip - Icons

<ComponentPreview name="charts/ChartTooltipIcons" class="theme-blue" />

### Tooltip - Advanced

<ComponentPreview name="charts/ChartTooltipAdvanced" class="theme-blue" />

