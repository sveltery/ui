<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import type { DocPage, NavSection } from '$lib/docs/types';
  import { site } from '$lib/site';

  let { class: className }: { class?: string } = $props();
  let panel: HTMLElement;
  let open = $state(false);
  const nav = $derived((page.data.nav ?? []) as NavSection[]);
  const sections = $derived(((page.data.sections ?? []) as DocPage[]).map((section) => ({ href: section.href, label: section.title })));

  afterNavigate(() => panel?.hidePopover());
</script>

{#snippet group(title: string, links: readonly { href: string; label: string }[])}
  <div class="flex flex-col gap-4">
    <div class="text-sm font-medium text-muted-foreground">{title}</div>
    <div class="flex flex-col gap-3">
      {#each links as link (link.href)}
        <a href={link.href} aria-current={page.url.pathname === link.href ? 'page' : undefined} class="flex items-center gap-2 text-2xl font-medium">{link.label}</a>
      {/each}
    </div>
  </div>
{/snippet}

<!-- A native popover: the browser handles light dismiss, Escape and the top layer. -->
<button
  type="button"
  popovertarget="mobile-nav"
  class="extend-touch-target inline-flex h-8 shrink-0 touch-manipulation items-center justify-start gap-2.5 rounded-md p-0 text-sm font-medium whitespace-nowrap outline-none {className}"
>
  <span class="relative flex h-8 w-4 items-center justify-center">
    <span class="relative size-4">
      <span class={['absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100', open ? 'top-[0.4rem] -rotate-45' : 'top-1']}></span>
      <span class={['absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100', open ? 'top-[0.4rem] rotate-45' : 'top-2.5']}></span>
    </span>
  </span>
  <span class="flex h-8 items-center text-lg leading-none font-medium">Menu</span>
</button>

<nav
  id="mobile-nav"
  popover
  bind:this={panel}
  ontoggle={(event) => (open = event.newState === 'open')}
  aria-label="Site"
  class="no-scrollbar inset-x-0 top-(--header-height) bottom-0 m-0 h-auto max-h-none w-full max-w-none overflow-y-auto border-none bg-background/90 p-0 text-foreground backdrop-blur"
>
  <div class="flex flex-col gap-12 overflow-auto px-6 py-6">
    {@render group('Menu', site.nav)}
    {@render group('Sections', sections)}
    <div class="flex flex-col gap-8">
      {#each nav as section (section.title)}
        {@render group(section.title, [...(section.href ? [{ href: section.href, label: section.title }] : []), ...section.pages.map((p) => ({ href: p.href, label: p.title }))])}
      {/each}
    </div>
  </div>
</nav>
