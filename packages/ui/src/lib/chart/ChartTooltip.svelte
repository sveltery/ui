<script lang="ts">
  import { Tooltip } from 'layerchart';
  import ChartTooltipContent from './ChartTooltipContent.svelte';
  import type { ChartTooltipProps } from './types.js';

  let { children: childrenProp, ...props }: ChartTooltipProps = $props();
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
