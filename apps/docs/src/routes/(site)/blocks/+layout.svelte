<script lang="ts">
  import { buttonVariants } from '@sveltery/components/button';
  import { cn } from 'cn';
  import { navCategories } from '#blocks/registry';
  import BlocksNav from '$lib/components/blocks/BlocksNav.svelte';
  import { site } from '$lib/site';
  let { children } = $props();

  const title = 'Building Blocks for the Web';
  const description = 'Clean, modern building blocks. Copy and paste into your apps. Open Source. Free forever.';
</script>

<svelte:head>
  <title>{title} - {site.name}</title>
  <meta name="description" content={description} />
</svelte:head>

<section class="container-wrapper flex flex-col items-center gap-2 px-6 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
  <h1 class="max-w-3xl text-3xl font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] xl:text-5xl xl:tracking-tighter">{title}</h1>
  <p class="max-w-4xl text-base text-balance text-foreground sm:text-lg">{description}</p>
  <div class="flex w-full items-center justify-center gap-2 pt-2">
    <a href="#blocks" class={cn(buttonVariants(), 'h-[35px] shadow-none')}>Browse Blocks</a>
    <a href="/docs/components" class={cn(buttonVariants({ variant: 'secondary' }), 'shadow-none')}>View Components</a>
  </div>
</section>
<div id="blocks" class="container-wrapper scroll-mt-24 px-6">
  <div class="flex items-center justify-between gap-4 py-4">
    <BlocksNav />
    <a href="/blocks/{navCategories[0].slug}" class={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'mr-7 hidden shadow-none lg:flex')}>Browse all blocks</a>
  </div>
</div>
<div class="container-wrapper flex-1 bg-muted/30 px-6 md:py-12">
  {@render children()}
</div>
