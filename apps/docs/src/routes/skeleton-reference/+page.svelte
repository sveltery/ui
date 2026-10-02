<script lang="ts">
  import { onMount } from 'svelte';
  import { createRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { SkeletonGallery } from '../../../../../tests/reference/SkeletonGallery';
  let node: HTMLDivElement;
  onMount(() => { const root = createRoot(node); root.render(createElement(SkeletonGallery)); return () => root.unmount(); });
</script>
<main class="p-8"><div bind:this={node}></div></main>
