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
    'cn-chart flex aspect-video flex-col justify-center text-xs [--ts-chart-tooltip-background:transparent] [--ts-chart-tooltip-border:0] [--ts-chart-tooltip-padding:0] [--ts-chart-tooltip-shadow:none] [&_.ts-chart]:text-muted-foreground [&_g[class$=grid]_:is(line,path)]:stroke-border [&_g[class$=grid]_:is(line,path)]:[stroke-opacity:1]',
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

