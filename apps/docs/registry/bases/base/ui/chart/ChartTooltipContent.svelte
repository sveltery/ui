<script lang="ts">
  import { cn } from 'cn';
  import type { ChartPoint } from '@tanstack/charts';
  import { useChart } from './context.js';
  import type { ChartTooltipContentProps } from './types.js';

  let {
    points,
    class: className,
    indicator = 'dot',
    hideLabel = false,
    hideIndicator = false,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
  }: ChartTooltipContentProps = $props();

  const chart = useChart();
  const config = $derived(chart.config);

  function field(point: ChartPoint, key: string) {
    const value = (point.datum as Record<string, unknown> | null)?.[key];
    return typeof value === 'string' ? value : undefined;
  }

  /** The config key of a row: a string field named by `nameKey`, else `nameKey` itself, else the series. */
  function seriesKey(point: ChartPoint) {
    if (nameKey) return field(point, nameKey) ?? nameKey;
    return String(point.group ?? point.markId);
  }

  /** A stacked or baselined mark reports its own interval; a pie slice reports the value `pie()` allocated. */
  function value(point: ChartPoint) {
    const { y1Value, y2Value, yValue } = point;
    if (typeof y1Value === 'number' && typeof y2Value === 'number') return y2Value - y1Value;
    const datumValue = (point.datum as Record<string, unknown> | null)?.value;
    return typeof datumValue === 'number' ? datumValue : yValue;
  }

  const tooltipLabel = $derived.by(() => {
    if (hideLabel || !points.length) return null;
    const [point] = points;
    const label = labelKey ? config[labelKey]?.label : (config[String(point.xValue)]?.label ?? point.xValue);
    if (labelFormatter) return { content: labelFormatter(label, points) };
    if (label == null || label === '') return null;
    return { content: label };
  });

  const nestLabel = $derived(points.length === 1 && indicator !== 'dot');
</script>

{#snippet labelNode()}{#if tooltipLabel}<div class={cn('font-medium', labelClassName)}>{String(tooltipLabel.content)}</div>{/if}{/snippet}

{#if points.length}<div class={cn('cn-chart-tooltip grid min-w-32 items-start', className)}
  >{#if !nestLabel}{@render labelNode()}{/if}<div class="grid gap-1.5">
      {#each points as point, index (point.key)}
        {const key = $derived(seriesKey(point))}
        {const itemConfig = $derived(config[key])}
        {const indicatorColor = $derived(color ?? point.color)}
        {const itemValue = $derived(value(point))}
        <div
          class={cn('flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground', indicator === 'dot' && 'items-center')}
        >{#if formatter}{@render formatter(itemValue, key, point, index)}{:else}{#if itemConfig?.icon}<itemConfig.icon />{:else if !hideIndicator}<div
                class={cn('shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)', {
                  'h-2.5 w-2.5': indicator === 'dot',
                  'w-1': indicator === 'line',
                  'w-0 border-[1.5px] border-dashed bg-transparent': indicator === 'dashed',
                  'my-0.5': nestLabel && indicator === 'dashed',
                })}
                style:--color-bg={indicatorColor}
                style:--color-border={indicatorColor}
              ></div>{/if}<div class={cn('flex flex-1 justify-between leading-none', nestLabel ? 'items-end' : 'items-center')}
            ><div class="grid gap-1.5">{#if nestLabel}{@render labelNode()}{/if}<span class="text-muted-foreground">{itemConfig?.label ?? key}</span></div
            >{#if itemValue != null}<span class="font-mono font-medium text-foreground tabular-nums"
                >{typeof itemValue === 'number' ? itemValue.toLocaleString() : String(itemValue)}</span
              >{/if}</div
          >{/if}</div>
      {/each}
    </div></div
  >{/if}
