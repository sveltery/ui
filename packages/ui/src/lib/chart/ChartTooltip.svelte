<script lang="ts">
  import { getChartContext, Tooltip } from 'layerchart';
  import ChartTooltipContent from './ChartTooltipContent.svelte';
  import { getChartContainer, type ChartRow } from './context.js';
  import type { ChartTooltipProps } from './types.js';

  let { children: childrenProp, ...props }: ChartTooltipProps = $props();

  const chart = getChartContext<ChartRow>();
  const container = getChartContainer();
  $effect(() => container.registerTooltip(chart));
</script>

<Tooltip.Root variant="none">
  {#snippet children({ data })}
    {#if childrenProp}
      {@render childrenProp({ data })}
    {:else}
      <ChartTooltipContent {...props} />
    {/if}
  {/snippet}
</Tooltip.Root>
