<script lang="ts">
  import { onMount } from 'svelte';
  import { createRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { TextareaGallery } from '../../../../../tests/reference/TextareaGallery';
  let node: HTMLDivElement;
  onMount(() => { const root = createRoot(node); root.render(createElement(TextareaGallery)); return () => root.unmount(); });
</script>
<main class="p-8"><div bind:this={node}></div></main>
