<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import type { NavSection } from '$lib/docs/types';
  import { site } from '$lib/site';

  let { class: className }: { class?: string } = $props();
  let panel: HTMLElement;
  const nav = $derived((page.data.nav ?? []) as NavSection[]);

  afterNavigate(() => panel?.hidePopover());
</script>

<!-- A native popover: the browser handles light dismiss, Escape and the top layer. -->
<button type="button" popovertarget="mobile-nav" class="extend-touch-target inline-flex h-8 items-center gap-2 rounded-md px-2 text-sm font-medium hover:bg-muted {className}">
  <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>
  Menu
</button>

<nav
  id="mobile-nav"
  popover
  bind:this={panel}
  aria-label="Site"
  class="inset-x-0 top-(--header-height) bottom-0 m-0 h-auto max-h-none w-full max-w-none overflow-y-auto border-t bg-background/95 p-6 text-foreground backdrop-blur"
>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <div class="text-sm font-medium text-muted-foreground">Menu</div>
      <a href="/" class="text-2xl font-medium">Home</a>
      {#each site.nav as item (item.href)}
        <a href={item.href} class="text-2xl font-medium">{item.label}</a>
      {/each}
    </div>
    {#each nav as section (section.title)}
      <div class="flex flex-col gap-3">
        <div class="text-sm font-medium text-muted-foreground">{section.title}</div>
        {#each section.pages as item (item.href)}
          <a href={item.href} aria-current={page.url.pathname === item.href ? 'page' : undefined} class="text-2xl font-medium">{item.title}</a>
        {/each}
      </div>
    {/each}
  </div>
</nav>
