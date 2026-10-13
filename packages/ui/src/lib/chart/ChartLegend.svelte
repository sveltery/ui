<script lang="ts">
  import ChartLegendContent from './ChartLegendContent.svelte';
  import type { ChartLegendProps } from './types.js';

  let { children, ...props }: ChartLegendProps = $props();
</script>

{#if children}
  {@render children()}
{:else}
  <ChartLegendContent {...props} />
{/if}
