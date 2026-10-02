<script lang="ts">
  import { onMount } from 'svelte';
  import { hydrateRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { TableGallery } from '../../../../../tests/reference/TableGallery';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
  let node: HTMLDivElement;
  onMount(() => { const root = hydrateRoot(node, createElement(TableGallery)); return () => root.unmount(); });
</script>

<main class="p-8"><div bind:this={node}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- React markup is generated exclusively from the trusted local reference harness. -->
  {@html data.html}
</div></main>
