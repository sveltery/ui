<script lang="ts">
  import { onMount } from 'svelte';
  import { createRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { CardGallery } from '../../../../../tests/reference/CardGallery';
  let node: HTMLDivElement;
  onMount(() => { const root = createRoot(node); root.render(createElement(CardGallery)); return () => root.unmount(); });
</script>
<main class="p-8"><div bind:this={node}></div></main>
