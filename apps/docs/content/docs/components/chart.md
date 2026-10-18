---
title: Chart
description: Beautiful charts. Built using Recharts. Copy and paste into your apps.
---

<Callout>

**Updated:** The `chart` component now uses [@sveltery/charts](https://github.com/sveltery/ui/tree/main/packages/charts), a Svelte port of Recharts v3. It replaces LayerChart. If you're updating existing chart code, see [Updating to Recharts v3](#updating-to-recharts-v3).

</Callout>

<ComponentPreview name="base/ChartDemoExample" class="theme-blue [&_[data-slot=preview]]:h-auto [&_[data-slot=preview]]:p-0 [&_[data-slot=preview]]:lg:min-h-[404px] [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:border-none [&_[data-slot=preview]_[data-slot=card]]:shadow-none" hideCode />

Introducing **Charts**. A collection of chart components that you can copy and paste into your apps.

Charts are designed to look great out of the box. They work well with the other components and are fully customizable to fit your project.

[Browse the Charts Library](#charts-library).

## Component

We use [Recharts](https://recharts.org/) under the hood, through [@sveltery/charts](https://github.com/sveltery/ui/tree/main/packages/charts), which ports Recharts' components to Svelte 5 with the same props and the same markup.

We designed the `chart` component with composition in mind. **You build your charts using Recharts components and only bring in custom components, such as `ChartTooltip`, when and where you need it**.

```svelte showLineNumbers
<script lang="ts">
  import { Bar, BarChart } from '@sveltery/charts';
  import { ChartContainer, ChartTooltip, ChartTooltipContent } from '#lib/components/ui/chart';
</script>

<ChartContainer>
  <BarChart {data}>
    <Bar dataKey="value" />
    <ChartTooltip>
      {#snippet content(props)}
        <ChartTooltipContent {...props} />
      {/snippet}
    </ChartTooltip>
  </BarChart>
</ChartContainer>
```

We do not wrap Recharts. This means you're not locked into an abstraction. When a new Recharts version is released, you can follow the official upgrade path to upgrade your charts.

Where Recharts takes a React element or a render function, such as the `content` of a tooltip, the Svelte port takes a snippet. The snippet receives the props Recharts would pass to the element, so spread them onto `ChartTooltipContent` or `ChartLegendContent`.

**The components are yours**.

## Updating to Recharts v3

If you're updating older chart code to Recharts v3:

- Use `var(--chart-1)` instead of `hsl(var(--chart-1))` when you reference chart tokens from your CSS variables.
- Use `ChartTooltip`'s `defaultIndex` for initial tooltip state only. Keep persistent active shapes in your own chart state.
- Remove `layout` from `<Bar>` when the parent `<BarChart>` already defines it.
- Keep a height, `min-h-*`, or `aspect-*` on `ChartContainer` so `ResponsiveContainer` can measure on first render.

Charts built on LayerChart need rewriting. Replace the LayerChart chart and its `series`, `x` and `y` props with a Recharts chart and one `<Bar>`, `<Line>` or `<Area>` per series, each with a `dataKey`. Replace the `tooltip` and `legend` snippets with `ChartTooltip` and `ChartLegend` and a `content` snippet. The examples on this page show each chart type.

## Installation

<InstallTabs>

<InstallTab value="cli">

```bash
npx @sveltery/ui@latest add chart
```

</InstallTab>

<InstallTab value="manual">

<Steps>

### Install the dependencies

```bash
npm install @sveltery/charts
```

<Callout>

**Note:** `@sveltery/charts` is not published to npm yet. Until it is, install it from a checkout of this repository.

</Callout>

### Copy the component

Copy the following files into `src/lib/components/ui/chart`.

<ComponentSource name="chart" />

### Add the following colors to your CSS file

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

</Steps>

</InstallTab>

</InstallTabs>

## Your First Chart

Let's build your first chart. We'll build a bar chart, add a grid, axis, tooltip and legend.

<Steps>

### Start by defining your data

The following data represents the number of desktop and mobile users for each month.

<Callout>

**Note:** Your data can be in any shape. You are not limited to the shape of the data below. Use the `dataKey` prop to map your data to the chart.

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

The chart config holds configuration for the chart. This is where you place human-readable strings, such as labels, icons and color tokens for theming.

```svelte title="src/lib/components/example-chart.svelte" showLineNumbers
<script lang="ts">
  import type { ChartConfig } from '#lib/components/ui/chart';

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#2563eb'
    },
    mobile: {
      label: 'Mobile',
      color: '#60a5fa'
    }
  } satisfies ChartConfig;
</script>
```

### Build your chart

You can now build your chart using Recharts components.

<Callout>

**Important:** Remember to set a `min-h-[VALUE]` on the `ChartContainer` component. This is required for the chart to be responsive.

</Callout>

<ComponentPreview name="charts/ChartExample" class="[&_[data-slot=preview]]:h-80" />

</Steps>

### Add a Grid

Let's add a grid to the chart.

<Steps>

### Import the `CartesianGrid` component.

```svelte
<script lang="ts">
  import { Bar, BarChart, CartesianGrid } from '@sveltery/charts';
</script>
```

### Add the `CartesianGrid` component to your chart.

```svelte showLineNumbers {3}
<ChartContainer config={chartConfig} class="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

<ComponentPreview name="charts/ChartExampleGrid" class="[&_[data-slot=preview]]:h-80" />

</Steps>

### Add an Axis

To add an x-axis to the chart, we'll use the `XAxis` component.

<Steps>

### Import the `XAxis` component.

```svelte
<script lang="ts">
  import { Bar, BarChart, CartesianGrid, XAxis } from '@sveltery/charts';
</script>
```

### Add the `XAxis` component to your chart.

```svelte showLineNumbers {4-10}
<ChartContainer config={chartConfig} class="h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

<ComponentPreview name="charts/ChartExampleAxis" class="[&_[data-slot=preview]]:h-80" />

</Steps>

### Add Tooltip

So far we've only used components from Recharts. They look great out of the box thanks to some customization in the `chart` component.

To add a tooltip, we'll use the custom `ChartTooltip` and `ChartTooltipContent` components from `chart`.

<Steps>

### Import the `ChartTooltip` and `ChartTooltipContent` components.

```svelte
<script lang="ts">
  import { ChartTooltip, ChartTooltipContent } from '#lib/components/ui/chart';
</script>
```

### Add the components to your chart.

```svelte showLineNumbers {11-15}
<ChartContainer config={chartConfig} class="h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <ChartTooltip>
      {#snippet content(props)}
        <ChartTooltipContent {...props} />
      {/snippet}
    </ChartTooltip>
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

<ComponentPreview name="charts/ChartExampleTooltip" class="[&_[data-slot=preview]]:h-80" />

Hover to see the tooltips. Easy, right? Two components, and we've got a beautiful tooltip.

</Steps>

### Add Legend

We'll do the same for the legend. We'll use the `ChartLegend` and `ChartLegendContent` components from `chart`.

<Steps>

### Import the `ChartLegend` and `ChartLegendContent` components.

```svelte
<script lang="ts">
  import { ChartLegend, ChartLegendContent } from '#lib/components/ui/chart';
</script>
```

### Add the components to your chart.

```svelte showLineNumbers {16-20}
<ChartContainer config={chartConfig} class="h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <ChartTooltip>
      {#snippet content(props)}
        <ChartTooltipContent {...props} />
      {/snippet}
    </ChartTooltip>
    <ChartLegend>
      {#snippet content(props)}
        <ChartLegendContent {...props} />
      {/snippet}
    </ChartLegend>
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

<ComponentPreview name="charts/ChartExampleLegend" class="[&_[data-slot=preview]]:h-80" />

</Steps>

Done. You've built your first chart! What's next?

- [Themes and Colors](/docs/components/chart#theming)
- [Tooltip](/docs/components/chart#tooltip)
- [Legend](/docs/components/chart#legend)

## Chart Config

The chart config is where you define the labels, icons and colors for a chart.

It is intentionally decoupled from chart data.

This allows you to share config and color tokens between charts. It can also work independently for cases where your data or color tokens live remotely or in a different format.

```svelte showLineNumbers
<script lang="ts">
  import MonitorIcon from '@lucide/svelte/icons/monitor';
  import type { ChartConfig } from '#lib/components/ui/chart';

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      icon: MonitorIcon,
      // A color like 'hsl(220, 98%, 61%)' or 'var(--color-name)'
      color: '#2563eb',
      // OR a theme object with 'light' and 'dark' keys
      theme: {
        light: '#2563eb',
        dark: '#dc2626'
      }
    }
  } satisfies ChartConfig;
</script>
```

## Theming

Charts have built-in support for theming. You can use css variables (recommended) or color values in any color format, such as hex, hsl or oklch.

### CSS Variables

<Steps>

### Define your colors in your css file

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

### Add the color to your `chartConfig`

```ts title="src/lib/components/example-chart.svelte" showLineNumbers
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)'
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;
```

</Steps>

### hex, hsl or oklch

You can also define your colors directly in the chart config. Use the color format you prefer.

```ts title="src/lib/components/example-chart.svelte" showLineNumbers
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb'
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(220, 98%, 61%)'
  },
  tablet: {
    label: 'Tablet',
    color: 'oklch(0.5 0.2 240)'
  },
  laptop: {
    label: 'Laptop',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;
```

### Using Colors

To use the theme colors in your chart, reference the colors using the format `var(--color-KEY)`.

#### Components

```svelte
<Bar dataKey="desktop" fill="var(--color-desktop)" />
```

#### Chart Data

```ts title="src/lib/components/example-chart.svelte" showLineNumbers
const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' }
];
```

#### Tailwind

```svelte title="src/lib/components/example-chart.svelte"
<LabelList class="fill-(--color-desktop)" />
```

## Tooltip

A chart tooltip contains a label, name, indicator and value. You can use a combination of these to customize your tooltip.

<ComponentPreview name="base/ChartTooltipExample" hideCode />

You can turn on/off any of these using the `hideLabel`, `hideIndicator` props and customize the indicator style using the `indicator` prop.

Use `labelKey` and `nameKey` to use a custom key for the tooltip label and name.

Chart comes with the `<ChartTooltip>` and `<ChartTooltipContent>` components. You can use these two components to add custom tooltips to your chart.

```svelte title="src/lib/components/example-chart.svelte"
<script lang="ts">
  import { ChartTooltip, ChartTooltipContent } from '#lib/components/ui/chart';
</script>
```

```svelte title="src/lib/components/example-chart.svelte"
<ChartTooltip>
  {#snippet content(props)}
    <ChartTooltipContent {...props} />
  {/snippet}
</ChartTooltip>
```

### Props

Use the following props to customize the tooltip.

| Prop            | Type                     | Description                                  |
| :-------------- | :----------------------- | :------------------------------------------- |
| `labelKey`      | string                   | The config or data key to use for the label. |
| `nameKey`       | string                   | The config or data key to use for the name.  |
| `indicator`     | `dot` `line` or `dashed` | The indicator style for the tooltip.         |
| `hideLabel`     | boolean                  | Whether to hide the label.                   |
| `hideIndicator` | boolean                  | Whether to hide the indicator.               |

### Colors

Colors are automatically referenced from the chart config.

### Custom

To use a custom key for tooltip label and names, use the `labelKey` and `nameKey` props.

```ts showLineNumbers
const chartData = [
  { browser: 'chrome', visitors: 187, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' }
];

const chartConfig = {
  visitors: {
    label: 'Total Visitors'
  },
  chrome: {
    label: 'Chrome',
    color: 'var(--chart-1)'
  },
  safari: {
    label: 'Safari',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;
```

```svelte title="src/lib/components/example-chart.svelte"
<ChartTooltip>
  {#snippet content(props)}
    <ChartTooltipContent labelKey="visitors" nameKey="browser" {...props} />
  {/snippet}
</ChartTooltip>
```

This will use `Total Visitors` for label and `Chrome` and `Safari` for the tooltip names.

## Legend

You can use the custom `<ChartLegend>` and `<ChartLegendContent>` components to add a legend to your chart.

```svelte title="src/lib/components/example-chart.svelte"
<script lang="ts">
  import { ChartLegend, ChartLegendContent } from '#lib/components/ui/chart';
</script>
```

```svelte title="src/lib/components/example-chart.svelte"
<ChartLegend>
  {#snippet content(props)}
    <ChartLegendContent {...props} />
  {/snippet}
</ChartLegend>
```

### Colors

Colors are automatically referenced from the chart config.

### Custom

To use a custom key for legend names, use the `nameKey` prop.

```ts showLineNumbers
const chartData = [
  { browser: 'chrome', visitors: 187, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' }
];

const chartConfig = {
  chrome: {
    label: 'Chrome',
    color: 'var(--chart-1)'
  },
  safari: {
    label: 'Safari',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;
```

```svelte title="src/lib/components/example-chart.svelte"
<ChartLegend>
  {#snippet content(props)}
    <ChartLegendContent nameKey="browser" {...props} />
  {/snippet}
</ChartLegend>
```

This will use `Chrome` and `Safari` for the legend names.

## Accessibility

You can turn on the `accessibilityLayer` prop to add an accessible layer to your chart.

This prop adds keyboard access and screen reader support to your charts.

```svelte title="src/lib/components/example-chart.svelte"
<LineChart accessibilityLayer />
```

## RTL

To enable RTL support in Sveltery UI, see the [RTL configuration guide](/docs/rtl).

Wrap the chart in a [DirectionProvider](/docs/components/direction), set `dir` on its container, and mirror the axis with `reversed`. Use the language selector to switch the language.

<ComponentPreview name="base/ChartRtlExample" direction="rtl" class="[&_[data-slot=preview]]:h-92" />

## Charts Library

The charts below port the [shadcn/ui charts](https://ui.shadcn.com/charts) to Svelte. Hover them to see their tooltips, and use View Code to copy one.

## Area

### Area Chart

<ComponentPreview name="charts/ChartAreaDefault" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Area Chart - Linear

<ComponentPreview name="charts/ChartAreaLinear" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Area Chart - Step

<ComponentPreview name="charts/ChartAreaStep" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Area Chart - Legend

<ComponentPreview name="charts/ChartAreaLegend" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Area Chart - Stacked

<ComponentPreview name="charts/ChartAreaStacked" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Area Chart - Stacked Expanded

<ComponentPreview name="charts/ChartAreaStackedExpand" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Area Chart - Icons

<ComponentPreview name="charts/ChartAreaIcons" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Area Chart - Gradient

<ComponentPreview name="charts/ChartAreaGradient" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Area Chart - Axes

<ComponentPreview name="charts/ChartAreaAxes" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Area Chart - Interactive

<ComponentPreview name="charts/ChartAreaInteractive" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full" />

## Bar

### Bar Chart

<ComponentPreview name="charts/ChartBarDefault" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Bar Chart - Horizontal

<ComponentPreview name="charts/ChartBarHorizontal" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Bar Chart - Multiple

<ComponentPreview name="charts/ChartBarMultiple" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Bar Chart - Label

<ComponentPreview name="charts/ChartBarLabel" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Bar Chart - Custom Label

<ComponentPreview name="charts/ChartBarLabelCustom" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Bar Chart - Mixed

<ComponentPreview name="charts/ChartBarMixed" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Bar Chart - Active

<ComponentPreview name="charts/ChartBarActive" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Bar Chart - Stacked + Legend

<ComponentPreview name="charts/ChartBarStacked" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Bar Chart - Negative

<ComponentPreview name="charts/ChartBarNegative" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Bar Chart - Interactive

<ComponentPreview name="charts/ChartBarInteractive" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full" />

## Line

### Line Chart

<ComponentPreview name="charts/ChartLineDefault" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Line Chart - Linear

<ComponentPreview name="charts/ChartLineLinear" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Line Chart - Step

<ComponentPreview name="charts/ChartLineStep" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Line Chart - Multiple

<ComponentPreview name="charts/ChartLineMultiple" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Line Chart - Dots

<ComponentPreview name="charts/ChartLineDots" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Line Chart - Dots Custom

<ComponentPreview name="charts/ChartLineDotsCustom" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Line Chart - Dots Colors

<ComponentPreview name="charts/ChartLineDotsColors" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Line Chart - Label

<ComponentPreview name="charts/ChartLineLabel" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Line Chart - Custom Label

<ComponentPreview name="charts/ChartLineLabelCustom" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Line Chart - Interactive

<ComponentPreview name="charts/ChartLineInteractive" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full" />

## Pie

### Pie Chart

<ComponentPreview name="charts/ChartPieSimple" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Pie Chart - Separator None

<ComponentPreview name="charts/ChartPieSeparatorNone" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Pie Chart - Label

<ComponentPreview name="charts/ChartPieLabel" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Pie Chart - Custom Label

<ComponentPreview name="charts/ChartPieLabelCustom" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Pie Chart - Label List

<ComponentPreview name="charts/ChartPieLabelList" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Pie Chart - Legend

<ComponentPreview name="charts/ChartPieLegend" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Pie Chart - Donut

<ComponentPreview name="charts/ChartPieDonut" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Pie Chart - Donut Active

<ComponentPreview name="charts/ChartPieDonutActive" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Pie Chart - Donut with Text

<ComponentPreview name="charts/ChartPieDonutText" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Pie Chart - Stacked

<ComponentPreview name="charts/ChartPieStacked" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Pie Chart - Interactive

<ComponentPreview name="charts/ChartPieInteractive" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

## Radar

### Radar Chart

<ComponentPreview name="charts/ChartRadarDefault" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Dots

<ComponentPreview name="charts/ChartRadarDots" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Lines Only

<ComponentPreview name="charts/ChartRadarLinesOnly" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Custom Label

<ComponentPreview name="charts/ChartRadarLabelCustom" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Radius Axis

<ComponentPreview name="charts/ChartRadarRadius" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Grid Custom

<ComponentPreview name="charts/ChartRadarGridCustom" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Grid Circle

<ComponentPreview name="charts/ChartRadarGridCircle" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Grid Circle - No Lines

<ComponentPreview name="charts/ChartRadarGridCircleNoLines" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Grid Circle Filled

<ComponentPreview name="charts/ChartRadarGridCircleFill" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Grid Filled

<ComponentPreview name="charts/ChartRadarGridFill" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Grid None

<ComponentPreview name="charts/ChartRadarGridNone" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Icons

<ComponentPreview name="charts/ChartRadarIcons" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Legend

<ComponentPreview name="charts/ChartRadarLegend" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radar Chart - Multiple

<ComponentPreview name="charts/ChartRadarMultiple" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

## Radial

### Radial Chart

<ComponentPreview name="charts/ChartRadialSimple" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radial Chart - Label

<ComponentPreview name="charts/ChartRadialLabel" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radial Chart - Grid

<ComponentPreview name="charts/ChartRadialGrid" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radial Chart - Text

<ComponentPreview name="charts/ChartRadialText" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radial Chart - Shape

<ComponentPreview name="charts/ChartRadialShape" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Radial Chart - Stacked

<ComponentPreview name="charts/ChartRadialStacked" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

## Tooltip examples

### Tooltip - Default

<ComponentPreview name="charts/ChartTooltipDefault" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Tooltip - Line Indicator

<ComponentPreview name="charts/ChartTooltipIndicatorLine" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Tooltip - No Indicator

<ComponentPreview name="charts/ChartTooltipIndicatorNone" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Tooltip - Custom Label

<ComponentPreview name="charts/ChartTooltipLabelCustom" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Tooltip - Label Formatter

<ComponentPreview name="charts/ChartTooltipLabelFormatter" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Tooltip - No Label

<ComponentPreview name="charts/ChartTooltipLabelNone" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Tooltip - Formatter

<ComponentPreview name="charts/ChartTooltipFormatter" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Tooltip - Icons

<ComponentPreview name="charts/ChartTooltipIcons" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

### Tooltip - Advanced

<ComponentPreview name="charts/ChartTooltipAdvanced" class="theme-blue [&_[data-slot=preview]_[data-slot=card]]:w-full [&_[data-slot=preview]_[data-slot=card]]:max-w-md" />

## Examples

<ComponentPreview name="base/ChartExample" class="theme-blue" />

## API reference

### ChartContainer

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `config` | `ChartConfig` | | Required. The label, icon, and color or theme of each key |
| `initialDimension` | `{ width: number; height: number }` | `{ width: 320, height: 200 }` | The size `ResponsiveContainer` renders before it measures the container |
| `id` | `string` | | Names the chart in `data-chart`. A generated id is used without it |
| `class` | `string` | | Added to the container. It is `aspect-video` by default |

`ChartContainer` passes every other attribute to its `div` and renders its children in a Recharts `ResponsiveContainer`.

### ChartTooltip and ChartLegend

`ChartTooltip` is the Recharts `Tooltip`, and `ChartLegend` is the Recharts `Legend`. Pass `ChartTooltipContent` or `ChartLegendContent` in their `content` snippet, and spread the snippet's props onto it.

### ChartTooltipContent

`ChartTooltipContent` takes the props the tooltip passes to its content, such as `active`, `payload`, `label` and `labelFormatter`, plus the following.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hideLabel` | `boolean` | `false` | Hides the label |
| `hideIndicator` | `boolean` | `false` | Hides the indicator |
| `indicator` | `'dot' \| 'line' \| 'dashed'` | `'dot'` | The indicator style |
| `labelKey` | `string` | | The config or data key to use for the label |
| `nameKey` | `string` | | The config or data key to use for the name |
| `labelClassName` | `string` | | Added to the label |
| `color` | `string` | | The indicator color of every row |
| `formatter` | `Snippet<[value, name, item, index, payload]>` | | Replaces the content of a row |
| `class` | `string` | | Added to the tooltip |

### ChartLegendContent

`ChartLegendContent` takes the props the legend passes to its content, such as `payload` and `verticalAlign`, plus the following.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `hideIcon` | `boolean` | `false` | Shows a color swatch even when the config has an icon |
| `nameKey` | `string` | | The config or data key to use for the name |
| `class` | `string` | | Added to the legend |

### ChartConfig

| Field | Type | Description |
| --- | --- | --- |
| `label` | `string` | The name shown in the tooltip and the legend |
| `icon` | `Component` | Shown in place of the color swatch |
| `color` | `string` | Any CSS color. Not allowed with `theme` |
| `theme` | `{ light: string; dark: string }` | A color for each mode. Not allowed with `color` |
