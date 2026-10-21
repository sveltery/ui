<script lang="ts">
  import { cn } from 'cn';
  import { useChart } from './context.js';
  import type { ChartLegendContentProps } from './types.js';

  let { class: className, hideIcon = false, keys, verticalAlign = 'bottom' }: ChartLegendContentProps = $props();

  const chart = useChart();
  const entries = $derived((keys ?? Object.keys(chart.config).filter((key) => chart.config[key].color ?? chart.config[key].theme)).map((key) => [key, chart.config[key]] as const));
</script>

{#if entries.length}<div class={cn('flex items-center justify-center gap-4', verticalAlign === 'top' ? 'pb-3' : 'pt-3', className)}>
    {#each entries as [key, itemConfig] (key)}
      <div class="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
        >{#if itemConfig?.icon && !hideIcon}<itemConfig.icon />{:else}<div class="h-2 w-2 shrink-0 rounded-[2px]" style:background-color="var(--color-{key})"></div>{/if}{itemConfig?.label}</div
      >
    {/each}
  </div>{/if}
