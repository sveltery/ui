<script lang="ts">
  import { onMount } from 'svelte';
  import { createRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { AspectRatioGallery } from '../../../../../tests/reference/AspectRatioGallery';
  let node: HTMLDivElement;
  onMount(() => { const root = createRoot(node); root.render(createElement(AspectRatioGallery)); return () => root.unmount(); });
</script>
<main class="p-8"><div bind:this={node}></div></main>
