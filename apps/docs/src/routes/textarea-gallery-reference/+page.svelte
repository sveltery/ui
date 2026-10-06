<script lang="ts">
  import { onMount } from 'svelte';
  import { createElement } from 'react';
  import { hydrateRoot } from 'react-dom/client';
  import { SelectedTextareaGallery } from '../../../../../tests/reference/SelectedTextareaGallery';
  let { data }: { data: { html: string } } = $props();
  let node: HTMLDivElement;
  onMount(() => { const root = hydrateRoot(node, createElement(SelectedTextareaGallery)); return () => root.unmount(); });
</script>
<main class="p-8"><div bind:this={node}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- Markup is generated only from immutable trusted reference components. -->
  {@html data.html}
</div></main>
