<script lang="ts">
  import { cn } from 'cn';
  import { defineChart } from '@tanstack/charts';
  import { tooltip as tooltipExtension } from '@tanstack/charts/tooltip';
  import { Chart } from '@tanstack/charts/svelte';
  import { setChart } from './context.js';
  import ChartStyle from './ChartStyle.svelte';
  import type { ChartContainerProps } from './types.js';

  let { id, class: className, config, definition, ariaLabel = 'Chart', tooltip, legend, initialWidth = 320, ...props }: ChartContainerProps = $props();

  const uniqueId = $props.id();
  const chartId = $derived(`chart-${id ?? uniqueId.replace(/:/g, '')}`);
  const tooltipOptions = { tooltip: { use: tooltipExtension, anchor: 'pointer', placement: ['right', 'left', 'bottom', 'top'], offset: 10 } } as const;
  const withTooltip = $derived(!tooltip ? definition : 'chart' in definition ? defineChart(definition, tooltipOptions) : defineChart(definition, tooltipOptions));

  setChart({
    get config() {
      return config;
    },
  });
</script>

<div
  data-slot="chart"
  data-chart={chartId}
  class={cn(
    'cn-chart flex aspect-video flex-col justify-center text-xs [--ts-chart-tooltip-background:transparent] [--ts-chart-tooltip-border:0] [--ts-chart-tooltip-padding:0] [--ts-chart-tooltip-shadow:none]',
    className
  )}
  {...props}
>
  <ChartStyle id={chartId} {config} />
  <div class="min-h-0 flex-1">
    <Chart definition={withTooltip} {ariaLabel} {initialWidth} style="height:100%" tooltipBody={tooltip} />
  </div>
  {@render legend?.()}
</div>

<style>
  /* TanStack paints guides with currentColor; shadcn's guides are muted text on border-colored lines. */
  [data-slot='chart'] :global(.ts-chart) {
    color: var(--muted-foreground);
  }
  [data-slot='chart'] :global(:is(.ts-chart__grid line, .ts-chart__radial-grid path, .ts-chart__angle-grid line)) {
    stroke: var(--border);
    stroke-opacity: 1;
  }
</style>
