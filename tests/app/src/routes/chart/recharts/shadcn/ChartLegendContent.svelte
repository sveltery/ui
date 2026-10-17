<script lang="ts">
  import { cn } from 'cn';
  import type { DefaultLegendContentProps, SvelteArgs } from '@sveltery/recharts';
  import { getPayloadConfigFromPayload, useChart } from './chart-context.js';

  let {
    class: className,
    hideIcon = false,
    payload,
    verticalAlign = 'bottom',
    nameKey,
  }: SvelteArgs<DefaultLegendContentProps> & { hideIcon?: boolean; nameKey?: string } = $props();

  const chart = useChart();
  const config = $derived(chart.config);
</script>

{#if payload?.length}<div class={cn('flex items-center justify-center gap-4', verticalAlign === 'top' ? 'pb-3' : 'pt-3', className)}>
    {#each payload.filter((item) => item.type !== 'none') as item, index (index)}
      {const key = $derived(`${nameKey ?? item.dataKey ?? 'value'}`)}
      {const itemConfig = $derived(getPayloadConfigFromPayload(config, item, key))}
      <div class={cn('flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground')}
        >{#if itemConfig?.icon && !hideIcon}<itemConfig.icon />{:else}<div class="h-2 w-2 shrink-0 rounded-[2px]" style:background-color={item.color}></div>{/if}{itemConfig?.label}</div
      >
    {/each}
  </div>{/if}
