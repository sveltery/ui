<script lang="ts">
  import { featured, navCategories } from '#blocks/registry';
  import BlockViewer from '$lib/components/blocks/BlockViewer.svelte';
</script>

<div class="flex flex-col gap-12 md:gap-24">
  {#each featured as block (block.name)}
    <BlockViewer {block} />
  {/each}
  <div class="container-wrapper">
    <div class="container flex justify-center py-6">
      <!-- Upstream renders this one with the new-york outline button. -->
      <a
        href="/blocks/{navCategories[0].slug}"
        data-slot="button"
        class="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:border-input dark:bg-input/30 dark:hover:bg-input/50">Browse more blocks</a
      >
    </div>
  </div>
</div>
