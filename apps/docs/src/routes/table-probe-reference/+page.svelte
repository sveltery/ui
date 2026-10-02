<script lang="ts">
  import { onMount } from 'svelte';
  import { createRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { TableProbe } from '../../../../../tests/reference/TableProbe';
  let node: HTMLDivElement;
  onMount(() => { const root = createRoot(node); root.render(createElement(TableProbe)); return () => root.unmount(); });
</script>

<main class="p-8"><div bind:this={node}></div></main>
