<script lang="ts">
  import { cn } from 'cn';
  import ChartStyle from './ChartStyle.svelte';
  import { setChartContainer } from './context.js';
  import type { ChartContainerProps } from './types.js';

  const uid = $props.id();
  let { id, config, class: classProp, children, ...props }: ChartContainerProps = $props();

  const chartId = $derived(`chart-${id ?? uid}`);

  setChartContainer({
    get config() {
      return config;
    }
  });
</script>

<div
  data-slot="chart"
  data-chart={chartId}
  class={cn(
    'cn-chart PortalTarget flex aspect-video justify-center text-xs',
    '[&_.lc-bar]:stroke-transparent [&_.lc-line]:stroke-border/50 [&_.lc-axis-tick]:stroke-0 [&_.lc-rule-y-line:not(.lc-grid-y-rule)]:stroke-0',
    '[&_.lc-highlight-point]:stroke-transparent [&_.lc-highlight-line]:stroke-0',
    '[&_.lc-text]:text-xs [&_text]:stroke-transparent [&_.lc-axis-tick-label]:fill-muted-foreground',
    '[&_.lc-grid-y-radial-line]:stroke-border [&_.lc-grid-y-radial-circle]:stroke-border',
    classProp
  )}
  {...props}
>
  <ChartStyle id={chartId} {config} />
  {@render children?.()}
</div>
