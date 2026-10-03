<script lang="ts">
  import { onMount } from 'svelte';
  import { hydrateRoot } from 'react-dom/client';
  import { createElement } from 'react';
  import { SeparatorProbe } from '../../../../../tests/reference/SeparatorProbe';
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
  let node: HTMLDivElement;
  onMount(() => { const root = hydrateRoot(node, createElement(SeparatorProbe)); return () => root.unmount(); });
</script>
<div bind:this={node}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- Trusted immutable local React reference; no user input. -->
  {@html data.html}
</div>
