<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Dialog } from '@sveltery/base/dialog';
  import * as Command from '@sveltery/command';
  import type { NavSection } from '$lib/docs/types';
  import { FullTextSearch } from '$lib/search.svelte';
  import { site } from '$lib/site';

  let open = $state(false);
  let query = $state('');
  let searching = $state(false);
  const search = new FullTextSearch();

  const nav = $derived((page.data.nav ?? []) as NavSection[]);
  const groups = $derived(
    nav.map((section) => ({
      title: section.title,
      pages: [...(section.href ? [{ href: section.href, title: section.title }] : []), ...section.pages],
    })),
  );

  $effect(() => {
    const current = query;
    searching = !!current.trim();
    search.run(current).then(() => {
      if (current === query) searching = false;
    });
  });

  const filter: Command.CommandFilter = (value, needle, keywords) => ((value + ' ' + (keywords?.join(' ') ?? '')).toLowerCase().includes(needle.toLowerCase()) ? 1 : 0);

  function go(href: string) {
    open = false;
    query = '';
    goto(href);
  }

  function onkeydown(event: KeyboardEvent) {
    if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || event.key === '/') {
      const target = event.target as HTMLElement;
      if (target.isContentEditable || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
      event.preventDefault();
      open = !open;
    }
  }

  const heading = '**:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3 **:[[cmdk-group-heading]]:pb-1 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground';
  const item =
    "relative flex h-9 cursor-default items-center gap-2 rounded-md border border-transparent px-3 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:border-input data-[selected=true]:bg-input/50 data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground";
  const kbd = "pointer-events-none flex h-5 items-center justify-center gap-1 rounded border bg-background px-1 font-sans text-[0.7rem] font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3";
</script>

<svelte:document {onkeydown} />

{#snippet arrow()}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" /></svg>
{/snippet}

<button
  type="button"
  class="relative inline-flex h-8 w-full shrink-0 items-center justify-start gap-2 rounded-lg border-none bg-muted px-4 py-2 pl-3 text-sm font-medium whitespace-nowrap text-foreground shadow-none transition-colors outline-none hover:bg-muted/50 hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:w-48 lg:w-40 xl:w-64 dark:bg-card dark:hover:bg-input/50"
  onclick={() => (open = true)}
>
  <span class="hidden xl:inline-flex">Search documentation...</span>
  <span class="inline-flex xl:hidden">Search...</span>
</button>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Popup
      class="fixed top-[15%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] gap-4 rounded-xl border-none bg-background bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 duration-200 outline-none sm:max-w-lg dark:bg-neutral-900 dark:ring-neutral-800"
    >
      <Dialog.Title class="sr-only">Search documentation...</Dialog.Title>
      <Dialog.Description class="sr-only">Search for a command to run...</Dialog.Description>
      <Command.Root {filter} class="flex h-full w-full flex-col overflow-hidden rounded-none bg-transparent text-popover-foreground">
        <div class="relative">
          <div class="flex h-9 items-center gap-2 rounded-md border border-input bg-input/50 px-3">
            <svg viewBox="0 0 24 24" class="size-4 shrink-0 opacity-50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <Command.Input bind:value={query} placeholder="Search documentation..." class="flex h-9 w-full rounded-md bg-transparent py-0 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
          {#if searching}
            <div class="pointer-events-none absolute top-1/2 right-3 z-10 flex -translate-y-1/2 items-center justify-center">
              <svg viewBox="0 0 24 24" class="size-4 animate-spin text-muted-foreground" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="status" aria-label="Loading"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
            </div>
          {/if}
        </div>
        <Command.List class="no-scrollbar max-h-[300px] min-h-80 scroll-py-1 scroll-pt-2 scroll-pb-1.5 overflow-x-hidden overflow-y-auto">
          <Command.Empty class="py-12 text-center text-sm text-muted-foreground">{searching ? 'Searching...' : 'No results found.'}</Command.Empty>
          <Command.Group heading="Pages" class="overflow-hidden p-0 text-foreground {heading}">
            {#each site.nav as link (link.href)}
              <Command.Item value="Navigation {link.label}" keywords={['nav', 'navigation', link.label.toLowerCase()]} onSelect={() => go(link.href)} class="{item} font-medium">
                {@render arrow()}
                {link.label}
              </Command.Item>
            {/each}
          </Command.Group>
          {#each groups as group (group.title)}
            <Command.Group heading={group.title} class="overflow-hidden p-0 text-foreground {heading}">
              {#each group.pages as doc (doc.href)}
                {const component = doc.href.includes('/components/')}
                <Command.Item value="{group.title} {doc.title}" keywords={component ? ['component'] : undefined} onSelect={() => go(doc.href)} class="{item} font-medium">
                  {#if component}
                    <div class="aspect-square size-4 rounded-full border border-dashed border-muted-foreground"></div>
                  {:else}
                    {@render arrow()}
                  {/if}
                  {doc.title}
                </Command.Item>
              {/each}
            </Command.Group>
          {/each}
          {#if query.trim() && search.hits.length}
            <Command.Group heading="Search Results" class="overflow-hidden px-0 text-foreground {heading}">
              {#each search.hits as hit (hit.href)}
                <Command.Item value="{hit.title} {hit.href}" forceMount onSelect={() => go(hit.href)} class="{item} font-normal">
                  <div class="line-clamp-1 text-sm">{hit.title}</div>
                </Command.Item>
              {/each}
            </Command.Group>
          {/if}
        </Command.List>
      </Command.Root>
      <div class="absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium text-muted-foreground dark:border-t-neutral-700 dark:bg-neutral-800">
        <div class="flex items-center gap-2">
          <kbd class={kbd}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 4v7a4 4 0 0 1-4 4H4" /><path d="m9 10-5 5 5 5" /></svg>
          </kbd>
          Go to Page
        </div>
      </div>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
