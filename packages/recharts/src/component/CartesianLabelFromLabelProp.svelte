<script lang="ts">
  import type { Props } from './Label.js';
  import { parseLabel, useCartesianLabelContext, type ImplicitLabelType } from './Label.hooks.svelte.js';
  import Label from './Label.svelte';

  let { label, labelRef }: { label: ImplicitLabelType | undefined; labelRef?: Props['labelRef'] } = $props();
  const viewBox = useCartesianLabelContext();
  const labelProps = $derived(parseLabel(label, viewBox.current, labelRef));
</script>

{#if labelProps}
  <Label {...labelProps} />
{/if}
