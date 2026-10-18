<script lang="ts">
  import { parseLabel, usePolarLabelContext, type ImplicitLabelType } from './Label.hooks.svelte.js';
  import Label from './Label.svelte';

  let { label }: { label: ImplicitLabelType | undefined } = $props();
  const viewBox = usePolarLabelContext();
  const labelProps = $derived(parseLabel(label, viewBox.current));
</script>

{#if labelProps}
  <Label {...labelProps} />
{/if}
