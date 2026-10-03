<script lang="ts">
  import { onMount } from 'svelte';
  import { hydrateRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { CssEnvironmentReference } from '../../../../../tests/reference/CssEnvironmentReference';
  let { data }: { data: { html: string } } = $props();
  let node: HTMLDivElement;
  onMount(() => { const root = hydrateRoot(node, createElement(CssEnvironmentReference)); return () => root.unmount(); });
</script>
<div bind:this={node}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- Trusted immutable-source React SSR; no user content. -->
  {@html data.html}
</div>
