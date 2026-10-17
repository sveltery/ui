<script lang="ts">
  import { Switch } from '$registry/bases/base/ui/switch';
  const styles = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'];
  // Each row starts a quarter pixel lower, so the switches land on every sub-pixel offset the browser rounds.
  const offsets = [0, 0.25, 0.5, 0.75];
</script>
{#each styles as style (style)}
  <div class="style-{style} px-2">
    {#each offsets as offset (offset)}
      <div class="flex items-start gap-4" style:padding-top="{8 + offset}px" style:height="28px">
        {#each ['sm', 'default'] as const as size (size)}
          <Switch {size} aria-label="{style} {size} off" />
          <Switch {size} aria-label="{style} {size} on" defaultChecked />
        {/each}
      </div>
    {/each}
  </div>
{/each}
