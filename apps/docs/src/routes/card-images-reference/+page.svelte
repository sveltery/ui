<script lang="ts">
  // Existing client-mounted original harness; no React SSR claim.
  import { onMount } from 'svelte';
  import { createRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { CardImageGallery } from '../../../../../tests/reference/CardImageGallery';
  let node: HTMLDivElement;
  onMount(() => { const root = createRoot(node); root.render(createElement(CardImageGallery)); return () => root.unmount(); });
</script>
<main class="p-8"><div bind:this={node}></div></main>
