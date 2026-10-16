<script lang="ts">
  import { cn } from 'cn';
  import { navCategories } from '#blocks/registry';
  import BlocksNav from '$lib/components/blocks/BlocksNav.svelte';
  import Announcement from '$lib/components/site/Announcement.svelte';
  import PageHeader from '$lib/components/site/PageHeader.svelte';
  import PageNav from '$lib/components/site/PageNav.svelte';
  import { lumaButtonVariants } from '$lib/components/site/luma-button';
  import { site } from '$lib/site';
  let { children } = $props();

  const title = 'Building Blocks for the Web';
  const description = 'Clean, modern building blocks. Copy and paste into your apps. Open Source. Free forever.';
</script>

<svelte:head>
  <title>{title} - {site.name}</title>
  <meta name="description" content={description} />
</svelte:head>

<PageHeader {title} {description}>
  {#snippet announcement()}<Announcement />{/snippet}
  <a href="#blocks" data-slot="button" class={cn(lumaButtonVariants(), 'h-[35px]')}>Browse Blocks</a>
  <a href="/docs/components" data-slot="button" class={lumaButtonVariants({ variant: 'secondary' })}>View Components</a>
</PageHeader>
<PageNav id="blocks">
  <BlocksNav />
  <a href="/blocks/{navCategories[0].slug}" data-slot="button" class={cn(lumaButtonVariants({ variant: 'secondary', size: 'sm' }), 'mr-7 hidden shadow-none lg:flex')}>Browse all blocks</a>
</PageNav>
<div class="container-wrapper flex-1 section-soft md:py-12">
  <div class="container">{@render children()}</div>
</div>
