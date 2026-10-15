<script lang="ts">
  import { getChartContext } from 'layerchart';
  import { cn } from 'cn';
  import { configColor, configKey, getChartContainer, type ChartRow } from './context.js';
  import type { ChartTooltipContentProps } from './types.js';

  let {
    hideLabel = false,
    hideIndicator = false,
    indicator = 'dot',
    nameKey,
    labelKey,
    label,
    labelFormatter,
    formatter,
    color,
    labelClass,
    class: classProp
  }: ChartTooltipContentProps = $props();

  const chart = getChartContext<ChartRow>();
  const { config } = getChartContainer();

  const data = $derived(chart.tooltip.data);
  const items = $derived(chart.tooltip.series.filter((series) => series.visible && series.value != null));
  const nestLabel = $derived(items.length === 1 && indicator !== 'dot');

  const header = $derived.by(() => {
    if (hideLabel || data == null) return;
    const category = label ?? (chart.valueAxis === 'x' ? chart.y : chart.x)?.(data);
    const itemConfig = config[configKey(config, data, labelKey ?? items[0]?.key ?? 'value')];
    const text = !labelKey && typeof category === 'string' ? config[category]?.label || category : itemConfig?.label;
    if (labelFormatter) return labelFormatter(text, items);
    if (text) return text;
  });

  const rows = $derived(
    items.map((series) => {
      const key = configKey(config, data, nameKey ?? series.key);
      return {
        series,
        name: config[key]?.label ?? series.label,
        icon: config[key]?.icon,
        color: color ?? configColor(config, key) ?? series.color
      };
    })
  );
</script>

{#snippet headerRow()}
  {#if header !== undefined}
    <div class={cn('font-medium', labelClass)}>{header}</div>
  {/if}
{/snippet}

<div class={cn('cn-chart-tooltip grid min-w-32 items-start', classProp)}>
  {#if !nestLabel}
    {@render headerRow()}
  {/if}
  <div class="grid gap-1.5">
    {#each rows as row, index (row.series.key)}
      {const Icon = row.icon}
      <div class={cn('flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground', indicator === 'dot' && 'items-center')}>
        {#if formatter && row.series.value !== undefined && row.series.label}
          {@render formatter({ item: row.series, data, index, name: row.name, value: row.series.value })}
        {:else}
          {#if Icon}
            <Icon />
          {:else if !hideIndicator}
            <div
              class={cn('shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)', {
                'h-2.5 w-2.5': indicator === 'dot',
                'w-1': indicator === 'line',
                'w-0 border-[1.5px] border-dashed bg-transparent': indicator === 'dashed',
                'my-0.5': nestLabel && indicator === 'dashed'
              })}
              style:--color-bg={row.color}
              style:--color-border={row.color}
            ></div>
          {/if}
          <div class={cn('flex flex-1 justify-between leading-none', nestLabel ? 'items-end' : 'items-center')}>
            <div class="grid gap-1.5">
              {#if nestLabel}
                {@render headerRow()}
              {/if}
              <span class="text-muted-foreground">{row.name}</span>
            </div>
            {#if row.series.value != null}
              <span class="font-mono font-medium text-foreground tabular-nums">
                {typeof row.series.value === 'number' ? row.series.value.toLocaleString() : String(row.series.value)}
              </span>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
