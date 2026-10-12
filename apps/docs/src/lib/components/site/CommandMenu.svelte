<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@sveltery/ui/dialog';
  import { Kbd, KbdGroup } from '@sveltery/ui/kbd';
  import { cn } from 'cn';
  import type { NavSection } from '$lib/docs/types';
  import { FullTextSearch, type Hit } from '$lib/search.svelte';

  let { class: className }: { class?: string } = $props();

  let open = $state(false);
  let query = $state('');
  let active = $state(0);
  const search = new FullTextSearch();

  const nav = $derived((page.data.nav ?? []) as NavSection[]);
  const groups = $derived.by(() => {
    const needle = query.trim().toLowerCase();
    const sections = nav
      .map((section) => ({
        title: section.title,
        hits: [...(section.href ? [{ href: section.href, title: section.title, excerpt: '' }] : []), ...section.pages.map((p) => ({ href: p.href, title: p.title, excerpt: '' }))].filter(
          (hit) => !needle || hit.title.toLowerCase().includes(needle),
        ),
      }))
      .filter((group) => group.hits.length);
    const titled = new Set(sections.flatMap((group) => group.hits.map((hit) => hit.href)));
    const text = search.hits.filter((hit) => !titled.has(hit.href));
    let index = 0;
    return (text.length ? [...sections, { title: 'Search results', hits: text }] : sections).map((group) => ({ ...group, hits: group.hits.map((hit) => ({ ...hit, index: index++ })) }));
  });
  const hits = $derived(groups.flatMap((group) => group.hits));

  $effect(() => {
    search.run(query);
  });

  $effect(() => {
    if (active >= hits.length) active = Math.max(0, hits.length - 1);
  });

  function select(hit: Hit | undefined) {
    if (!hit) return;
    open = false;
    query = '';
    goto(hit.href);
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!hits.length) return;
      active = (active + (event.key === 'ArrowDown' ? 1 : -1) + hits.length) % hits.length;
      document.getElementById(`search-option-${active}`)?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      select(hits[active]);
    }
  }

  function onWindowKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target.isContentEditable || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
      if (!(event.key === 'k' && (event.metaKey || event.ctrlKey))) return;
    }
    if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || event.key === '/') {
      event.preventDefault();
      open = !open;
    }
  }
</script>

<svelte:window onkeydown={onWindowKeydown} />

<button
  type="button"
  class={cn(
    'relative inline-flex h-8 w-full items-center justify-start gap-2 rounded-lg bg-surface px-3 text-sm font-normal text-foreground/60 shadow-none transition-colors hover:bg-muted sm:pr-12 md:w-48 lg:w-56 xl:w-64 dark:bg-card',
    className,
  )}
  onclick={() => (open = true)}
>
  <span class="hidden lg:inline-flex">Search documentation...</span>
  <span class="inline-flex lg:hidden">Search...</span>
  <KbdGroup class="absolute top-1.5 right-1.5 hidden sm:flex"><Kbd class="border">⌘</Kbd><Kbd class="border">K</Kbd></KbdGroup>
</button>

<Dialog bind:open>
  <DialogContent showCloseButton={false} class="gap-0 overflow-hidden rounded-xl p-0 sm:max-w-lg">
    <DialogTitle class="sr-only">Search documentation</DialogTitle>
    <DialogDescription class="sr-only">Search for a page or a phrase in the docs.</DialogDescription>
    <div class="flex items-center gap-2 border-b px-3">
      <svg viewBox="0 0 24 24" class="size-4 shrink-0 opacity-50" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      <input
        bind:value={query}
        {onkeydown}
        oninput={() => (active = 0)}
        role="combobox"
        aria-expanded="true"
        aria-controls="search-results"
        aria-activedescendant={hits.length ? `search-option-${active}` : undefined}
        aria-autocomplete="list"
        placeholder="Search documentation..."
        class="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
    <div id="search-results" role="listbox" aria-label="Results" class="no-scrollbar max-h-80 overflow-y-auto p-1.5">
      {#each groups as group (group.title)}
        <div role="group" aria-label={group.title}>
          <div class="px-2 py-1.5 text-xs font-medium text-muted-foreground">{group.title}</div>
          {#each group.hits as hit (hit.href)}
            <a
              id="search-option-{hit.index}"
              href={hit.href}
              role="option"
              aria-selected={hit.index === active}
              class="flex flex-col gap-0.5 rounded-md px-3 py-2 text-sm aria-selected:bg-muted"
              onclick={(event) => (event.preventDefault(), select(hit))}
              onpointermove={() => (active = hit.index)}
            >
              <span class="font-medium">{hit.title}</span>
              {#if hit.excerpt}<span class="line-clamp-2 text-xs text-muted-foreground [&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:text-foreground">{@html hit.excerpt}</span>{/if}
            </a>
          {/each}
        </div>
      {:else}
        <p class="py-6 text-center text-sm text-muted-foreground">No results found.</p>
      {/each}
    </div>
    {#if query && !search.available}
      <p class="border-t px-3 py-2 text-xs text-muted-foreground">Full-text search runs on the built site. This list matches page titles.</p>
    {/if}
  </DialogContent>
</Dialog>
