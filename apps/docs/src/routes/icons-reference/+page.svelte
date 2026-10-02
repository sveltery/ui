<script lang="ts">
  import { onMount } from 'svelte';
  import { createRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { IconsProbe } from '../../../../../tests/reference/IconsProbe';
  let host: HTMLDivElement;
  onMount(() => { const root = createRoot(host); root.render(createElement(IconsProbe)); return () => root.unmount(); });
</script>
<main class="p-8"><h1>Configurable icon reference probe</h1><div bind:this={host}></div></main>
