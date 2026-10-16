<script lang="ts">
  import type { ChartConfig } from './context.js';

  let { id, config }: { id: string; config: ChartConfig } = $props();

  // Format: { THEME_NAME: CSS_SELECTOR }
  const THEMES = { light: '', dark: '.dark' } as const;

  const colorConfig = $derived(Object.entries(config).filter(([, item]) => item.theme ?? item.color));
  const css = $derived(
    Object.entries(THEMES)
      .map(
        ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color = item.theme?.[theme as keyof typeof THEMES] ?? item.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}
`
      )
      .join('\n')
  );
</script>

{#if colorConfig.length}
  <svelte:element this={'style'}>{css}</svelte:element>
{/if}
