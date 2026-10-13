<script lang="ts">
  import { onMount } from 'svelte';
  import { site } from '$lib/site';
  let { data } = $props();

  // Browser tests wait for this before they use interactive controls.
  onMount(() => (document.documentElement.dataset.ready = ''));
</script>

<svelte:head>
  <title>{data.block.name} - {site.name}</title>
  <meta name="description" content={data.block.description} />
</svelte:head>

<div class="bg-background">
  <data.component />
</div>
