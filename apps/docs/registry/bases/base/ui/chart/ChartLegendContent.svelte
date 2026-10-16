<script lang="ts">
  import { getChartContext } from 'layerchart';
  import { cn } from 'cn';
  import { configColor, getChartContainer, type ChartRow } from './context.js';
  import type { ChartLegendContentProps } from './types.js';

  let { hideIcon = false, nameKey, verticalAlign = 'bottom', class: classProp }: ChartLegendContentProps = $props();

  const chart = getChartContext<ChartRow>();
  const { config } = getChartContainer();

  const items = $derived(
    nameKey
      ? chart.flatData.map((row) => String(row[nameKey])).map((key) => ({ key, label: config[key]?.label, icon: config[key]?.icon, color: configColor(config, key) ?? chart.cScale?.(key) }))
      : chart.series.series.map((series) => ({
          key: series.key,
          label: config[series.key]?.label ?? series.label,
          icon: config[series.key]?.icon,
          color: configColor(config, series.key) ?? series.color
        }))
  );
</script>

<div class={cn('absolute inset-x-0 flex items-center justify-center gap-4', verticalAlign === 'top' ? 'top-0 pb-3' : 'bottom-0 pt-3', classProp)}>
  {#each items as item (item.key)}
    {const Icon = item.icon}
    <div class="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground">
      {#if Icon && !hideIcon}
        <Icon />
      {:else}
        <div class="h-2 w-2 shrink-0 rounded-[2px]" style:background-color={item.color}></div>
      {/if}
      {item.label}
    </div>
  {/each}
</div>
