<script lang="ts">
  import { buttonVariants } from '@sveltery/ui/button';
  import BlockViewer from '$lib/components/blocks/BlockViewer.svelte';
  let { data } = $props();
</script>

<div class="flex flex-col gap-12 md:gap-24">
  {#each data.blocks as block (block.name)}
    <BlockViewer {block} />
  {/each}
  <div class="flex justify-center py-6">
    <a href="/blocks/sidebar" class={buttonVariants({ variant: 'outline' })}>Browse more blocks</a>
  </div>
</div>
