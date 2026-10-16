<script lang="ts">
  import { buttonVariants } from '@sveltery/components/button';
  import { featured, navCategories } from '#blocks/registry';
  import BlockViewer from '$lib/components/blocks/BlockViewer.svelte';
</script>

<div class="flex flex-col gap-12 md:gap-24">
  {#each featured as block (block.name)}
    <BlockViewer {block} />
  {/each}
  <div class="flex justify-center py-6">
    <a href="/blocks/{navCategories[0].slug}" class={buttonVariants({ variant: 'outline' })}>Browse more blocks</a>
  </div>
</div>
