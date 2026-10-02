<script lang="ts">
  import { onMount } from 'svelte';
  import { createRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { LabelGallery } from '../../../../../tests/reference/LabelGallery';
  let node: HTMLDivElement;
  onMount(() => { const root = createRoot(node); root.render(createElement(LabelGallery)); return () => root.unmount(); });
</script>
<main class="p-8"><div bind:this={node}></div></main>
