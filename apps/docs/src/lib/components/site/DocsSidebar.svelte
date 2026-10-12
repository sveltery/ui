<script lang="ts">
  import { page } from '$app/state';
  import type { NavSection } from '$lib/docs/types';

  let { nav }: { nav: NavSection[] } = $props();

  const itemClass =
    'relative flex h-[30px] w-fit items-center rounded-md border border-transparent px-2 text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 aria-[current=page]:border-accent aria-[current=page]:bg-accent';
</script>

<aside class="sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-var(--header-height)-2rem)] overflow-hidden lg:flex">
  <div class="absolute top-12 right-2 bottom-0 hidden w-px bg-[linear-gradient(to_bottom,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)] lg:flex"></div>
  <nav aria-label="Docs" class="no-scrollbar flex w-56 flex-col gap-6 overflow-y-auto pt-12 pb-8 pl-2.5">
    {#each nav as section (section.title)}
      <div class="flex flex-col gap-0.5">
        {#if section.href}
          <a href={section.href} aria-current={page.url.pathname === section.href ? 'page' : undefined} class="{itemClass} text-muted-foreground">{section.title}</a>
        {:else}
          <div class="flex h-8 items-center px-2 text-xs font-medium text-muted-foreground">{section.title}</div>
        {/if}
        {#each section.pages as item (item.href)}
          <a href={item.href} aria-current={page.url.pathname === item.href ? 'page' : undefined} class={itemClass}>{item.title}</a>
        {/each}
      </div>
    {/each}
  </nav>
</aside>
