<script lang="ts">
  import { onMount } from 'svelte';
  import { hydrateRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { AlertGallery } from '../../../../../tests/reference/AlertGallery';
  let { data }: { data: { html: string } } = $props();
  let node: HTMLDivElement;
  onMount(() => { const root = hydrateRoot(node, createElement(AlertGallery)); return () => root.unmount(); });
</script>
<main class="p-8"><!-- eslint-disable-next-line svelte/no-at-html-tags -- Trusted immutable source-derived React SSR markup; no user content. -->
<div bind:this={node}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- React markup is generated exclusively from the trusted local reference harness. -->
  {@html data.html}
</div></main>
