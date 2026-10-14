<script lang="ts">
  import BlockViewer from '$lib/components/blocks/BlockViewer.svelte';
  import { site } from '$lib/site';
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.category} Blocks - {site.name}</title>
</svelte:head>

<div class="flex flex-col gap-12 md:gap-24">
  {#each data.blocks as block (block.name)}
    <BlockViewer {block} />
  {/each}
</div>
