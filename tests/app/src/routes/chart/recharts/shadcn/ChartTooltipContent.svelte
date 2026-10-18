<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { SvelteArgs, TooltipContentProps, TooltipNameType, TooltipPayloadEntry, TooltipValueType } from '@sveltery/charts';

  /** What a Tooltip content snippet hands on: the Tooltip's props, less its formatter, which ChartTooltipContent replaces. */
  export type TooltipContentArgs = Omit<SvelteArgs<TooltipContentProps>, 'formatter'>;

  /** shadcn's formatter returns a node; here it is a snippet with the same arguments. */
  export type ChartTooltipFormatter = Snippet<
    [value: TooltipValueType, name: TooltipNameType, item: TooltipPayloadEntry, index: number, payload: TooltipPayloadEntry['payload']]
  >;

  export type ChartTooltipContentProps = TooltipContentArgs & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
    labelClassName?: string;
    color?: string;
    formatter?: ChartTooltipFormatter;
  };
</script>

<script lang="ts">
  import { cn } from 'cn';
  import { getPayloadConfigFromPayload, useChart } from './chart-context.js';

  let {
    active,
    payload,
    class: className,
    indicator = 'dot',
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
  }: ChartTooltipContentProps = $props();

  const chart = useChart();
  const config = $derived(chart.config);

  const tooltipLabel = $derived.by(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value = !labelKey && typeof label === 'string' ? (config[label]?.label ?? label) : itemConfig?.label;

    if (labelFormatter) {
      return { content: labelFormatter(value, payload) };
    }

    if (!value) {
      return null;
    }

    return { content: value };
  });

  const nestLabel = $derived(payload?.length === 1 && indicator !== 'dot');
</script>

{#snippet labelNode()}{#if tooltipLabel}<div class={cn('font-medium', labelClassName)}>{tooltipLabel.content}</div>{/if}{/snippet}

{#if active && payload?.length}<div
    class={cn('grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl', className)}
  >{#if !nestLabel}{@render labelNode()}{/if}<div class="grid gap-1.5">
      {#each payload.filter((item) => item.type !== 'none') as item, index (index)}
        {const key = $derived(`${nameKey ?? item.name ?? item.dataKey ?? 'value'}`)}
        {const itemConfig = $derived(getPayloadConfigFromPayload(config, item, key))}
        {const indicatorColor = $derived(color ?? item.payload?.fill ?? item.color)}
        <div
          class={cn('flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground', indicator === 'dot' && 'items-center')}
        >{#if formatter && item?.value !== undefined && item.name}{@render formatter(item.value, item.name, item, index, item.payload)}{:else}{#if itemConfig?.icon}<itemConfig.icon />{:else if !hideIndicator}<div
                class={cn('shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)', {
                  'h-2.5 w-2.5': indicator === 'dot',
                  'w-1': indicator === 'line',
                  'w-0 border-[1.5px] border-dashed bg-transparent': indicator === 'dashed',
                  'my-0.5': nestLabel && indicator === 'dashed',
                })}
                style:--color-bg={indicatorColor}
                style:--color-border={indicatorColor}
              ></div>{/if}<div class={cn('flex flex-1 justify-between leading-none', nestLabel ? 'items-end' : 'items-center')}
            ><div class="grid gap-1.5">{#if nestLabel}{@render labelNode()}{/if}<span class="text-muted-foreground">{itemConfig?.label ?? item.name}</span></div
            >{#if item.value != null}<span class="font-mono font-medium text-foreground tabular-nums"
                >{typeof item.value === 'number' ? item.value.toLocaleString() : String(item.value)}</span
              >{/if}</div
          >{/if}</div>
      {/each}
    </div></div
  >{/if}
