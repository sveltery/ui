<script lang="ts">
  import { on } from 'svelte/events';
  import { cn } from 'cn';
  import type { ChartState } from 'layerchart';
  import { setChartContainer, type ChartRow } from './context.js';
  import type { ChartContainerProps } from './types.js';

  const uid = $props.id();
  let { config, class: classProp, children, ...props }: ChartContainerProps = $props();

  const chartId = $derived(`chart-${props.id ?? uid}`);
  let tooltipChart = $state.raw<ChartState<ChartRow>>();

  setChartContainer({
    get config() {
      return config;
    },
    registerTooltip(chart) {
      tooltipChart = chart;
      return () => {
        if (tooltipChart === chart) tooltipChart = undefined;
      };
    },
  });

  const entries = $derived(Object.entries(config));
  const css = $derived.by(() => {
    const light = entries.flatMap(([key, item]) => {
      const color = item.theme?.light ?? item.color;
      return color ? [`--color-${key}: ${color};`] : [];
    });
    const dark = entries.flatMap(([key, item]) => (item.theme ? [`--color-${key}: ${item.theme.dark};`] : []));
    return `[data-chart=${chartId}] { ${light.join(' ')} }\n.dark [data-chart=${chartId}] { ${dark.join(' ')} }`;
  });

  // LayerChart has no keyboard tooltip. The container steps through the chart's rows and shows each one through the chart's tooltip.
  function keyboard(node: HTMLElement) {
    const chart = tooltipChart;
    if (!chart) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as const;
    const offKeydown = on(node, 'keydown', (event) => {
      const rows = chart.flatData;
      const last = rows.length - 1;
      if (event.key === 'Escape') return chart.tooltip.hide();
      const current = rows.indexOf(chart.tooltip.data);
      const next =
        event.key === 'Home' ? 0
        : event.key === 'End' ? last
        : event.key in step ? current + step[event.key as keyof typeof step]
        : undefined;
      if (next === undefined) return;
      event.preventDefault();
      chart.tooltip.show({ data: rows[Math.min(Math.max(next, 0), last)] });
    });
    const offBlur = on(node, 'blur', () => chart.tooltip.hide());
    return () => {
      offKeydown();
      offBlur();
    };
  }
</script>

<!-- The tabindex and role exist only while a tooltip is registered. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  data-slot="chart"
  data-chart={chartId}
  tabindex={tooltipChart ? 0 : undefined}
  role={tooltipChart ? 'application' : undefined}
  aria-roledescription={tooltipChart ? 'chart' : undefined}
  class={cn(
    'PortalTarget flex aspect-video justify-center text-xs focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-hidden',
    '[&_.lc-bar]:stroke-transparent [&_.lc-line]:stroke-border/50 [&_.lc-axis-tick]:stroke-0 [&_.lc-rule-y-line:not(.lc-grid-y-rule)]:stroke-0',
    '[&_.lc-highlight-point]:stroke-transparent [&_.lc-highlight-line]:stroke-0',
    '[&_.lc-text]:text-xs [&_text]:stroke-transparent [&_.lc-axis-tick-label]:fill-muted-foreground',
    '[&_.lc-grid-y-radial-line]:stroke-border [&_.lc-grid-y-radial-circle]:stroke-border',
    classProp
  )}
  {...props}
  {@attach keyboard}
>
  <svelte:element this={'style'}>{css}</svelte:element>
  {@render children?.()}
</div>
