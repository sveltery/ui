<script lang="ts">
  import { THEMES, type ChartConfig } from './context.js';

  let { id, config }: { id: string; config: ChartConfig } = $props();

  const colorConfig = $derived(Object.entries(config).filter(([, config]) => config.theme ?? config.color));
  const html = $derived(
    Object.entries(THEMES)
      .map(
        ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}
`
      )
      .join('\n')
  );
</script>

{#if colorConfig.length}<svelte:element this={'style'}>{html}</svelte:element>{/if}
