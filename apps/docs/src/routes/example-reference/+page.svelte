<script lang="ts">
  import { onMount } from 'svelte';
  import { createElement } from 'react';
  import { hydrateRoot } from 'react-dom/client';
  import { ExampleProbe } from '../../../../../tests/reference/ExampleProbe';
  let { data } = $props();
  let node: HTMLDivElement;
  let hydrated = $state(false);
  onMount(() => { const root = hydrateRoot(node, createElement(ExampleProbe)); hydrated = true; return () => root.unmount(); });
</script>
<main data-hydrated={hydrated}><div bind:this={node}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- React markup is generated exclusively from the trusted local source-derived reference harness. -->
  {@html data.html}
</div></main>
