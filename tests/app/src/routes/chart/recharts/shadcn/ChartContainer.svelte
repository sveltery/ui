<script lang="ts">
  import { cn } from 'cn';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { ResponsiveContainer } from '@sveltery/recharts';
  import { setChart, type ChartConfig } from './chart-context.js';
  import ChartStyle from './ChartStyle.svelte';

  const INITIAL_DIMENSION = { width: 320, height: 200 } as const;

  let {
    id,
    class: className,
    children,
    config,
    initialDimension = INITIAL_DIMENSION,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & { config: ChartConfig; children: Snippet; initialDimension?: { width: number; height: number } } = $props();

  const uniqueId = $props.id();
  const chartId = $derived(`chart-${id ?? uniqueId.replace(/:/g, '')}`);
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
    "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
    className,
  )}
  {...rest}
>
  <ChartStyle id={chartId} {config} />
  <ResponsiveContainer {initialDimension}>{@render children()}</ResponsiveContainer>
</div>
