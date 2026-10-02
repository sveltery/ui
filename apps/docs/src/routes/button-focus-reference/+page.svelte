<script lang="ts">
  import { onMount } from 'svelte';
  import { hydrateRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { ButtonFocusProbe } from '../../../../../tests/reference/ButtonFocusProbe';
  let { data }: { data: { html: string; custom: boolean } } = $props();
  let node: HTMLDivElement;
  onMount(() => { const root = hydrateRoot(node, createElement(ButtonFocusProbe, { custom: data.custom })); return () => root.unmount(); });
</script>
<div bind:this={node}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- Trusted immutable source-derived React fixture markup. -->
  {@html data.html}
</div>
