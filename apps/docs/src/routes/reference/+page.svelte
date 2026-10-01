<script lang="ts">
  import { onMount } from 'svelte';
  import { createRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { Example } from '../../../../../tests/reference/Example';
  let node: HTMLDivElement;
  onMount(() => { const root = createRoot(node); root.render(createElement(Example)); return () => root.unmount(); });
</script>
<div bind:this={node}></div>
