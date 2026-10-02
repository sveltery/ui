<script lang="ts">
  import { onMount } from 'svelte';
  import { hydrateRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { AspectRatioProbe } from '../../../../../tests/reference/AspectRatioProbe';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
  let node: HTMLDivElement;
  onMount(() => { const root = hydrateRoot(node, createElement(AspectRatioProbe)); return () => root.unmount(); });
</script>
<main><div bind:this={node}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- Trusted local React reference generated without user input. -->
  {@html data.html}
</div></main>
