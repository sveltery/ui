<script lang="ts">
  import { onMount } from 'svelte';
  import { createRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { KbdGallery } from '../../../../../tests/reference/KbdGallery';
  let node: HTMLDivElement;
  onMount(() => { const root = createRoot(node); root.render(createElement(KbdGallery)); return () => root.unmount(); });
</script>
<main class="p-8"><button>Before keys</button><div bind:this={node}></div><button>After keys</button></main>
