<script lang="ts">
  import { page } from '$app/state';
  import DocsCopyPage from '$lib/components/docs/DocsCopyPage.svelte';
  import DocsToc from '$lib/components/site/DocsToc.svelte';
  import { replaceComponentsList } from '$lib/docs/markdown';
  import { site } from '$lib/site';

  let { data } = $props();

  const pages = $derived(data.nav.flatMap((section) => [...(section.href ? [{ href: section.href, title: section.title }] : []), ...section.pages]));
  const current = $derived(pages.findIndex((p) => p.href === page.url.pathname));
  const previous = $derived(current > 0 ? pages[current - 1] : undefined);
  const next = $derived(current >= 0 ? pages[current + 1] : undefined);
  const markdown = $derived(replaceComponentsList(data.raw, data.nav));
</script>

<svelte:head>
  <title>{data.metadata.title} - {site.name}</title>
  <meta name="description" content={data.metadata.description} />
</svelte:head>

{#snippet arrow(direction: 'left' | 'right')}
  <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d={direction === 'left' ? 'M5 12h14M5 12l6 6M5 12l6-6' : 'M5 12h14M13 18l6-6M13 6l6 6'} />
  </svg>
{/snippet}

<div data-slot="docs" class="flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full">
  <div class="flex min-w-0 flex-1 flex-col">
    <div class="h-(--top-spacing) shrink-0"></div>
    <article data-pagefind-body class="mx-auto flex w-full max-w-160 min-w-0 flex-1 flex-col gap-6 px-4 py-6 text-foreground md:px-0 lg:py-8">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between md:items-start">
          <h1 class="scroll-m-24 text-3xl font-semibold tracking-tight">{data.metadata.title}</h1>
          <div class="docs-nav flex items-center gap-2" data-pagefind-ignore>
            <div class="hidden sm:block">
              <DocsCopyPage page={markdown} url="{site.url}{page.url.pathname}" />
            </div>
            <div class="ml-auto flex gap-2">
              {#if previous}
                <a href={previous.href} class="extend-touch-target inline-flex size-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 md:size-7">
                  {@render arrow('left')}<span class="sr-only">Previous</span>
                </a>
              {/if}
              {#if next}
                <a href={next.href} class="extend-touch-target inline-flex size-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 md:size-7">
                  <span class="sr-only">Next</span>{@render arrow('right')}
                </a>
              {/if}
            </div>
          </div>
        </div>
        <p class="text-[1.05rem] text-muted-foreground sm:text-base sm:text-balance md:max-w-[80%]">{data.metadata.description}</p>
      </div>
      <div class="typeset w-full flex-1 pb-16 *:data-[slot=alert]:first:mt-0 sm:pb-0">
        <data.content />
      </div>
      <nav aria-label="Pagination" class="hidden h-16 w-full items-center gap-2 px-4 sm:flex sm:px-0" data-pagefind-ignore>
        {#if previous}
          <a href={previous.href} class="inline-flex h-8 items-center gap-1.5 rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 has-[>svg]:px-2.5">{@render arrow('left')} {previous.title}</a>
        {/if}
        {#if next}
          <a href={next.href} class="ml-auto inline-flex h-8 items-center gap-1.5 rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 has-[>svg]:px-2.5">{next.title} {@render arrow('right')}</a>
        {/if}
      </nav>
    </article>
  </div>
  <div class="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[90svh] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
    <div class="h-(--top-spacing) shrink-0"></div>
    {#if data.metadata.toc.length}
      <div class="no-scrollbar flex scroll-fade flex-col gap-8 overflow-y-auto px-8">
        <DocsToc toc={data.metadata.toc} />
      </div>
    {/if}
  </div>
</div>
