<script lang="ts">
  import { page } from '$app/state';
  import { Separator } from '@sveltery/ui/separator';
  import { site } from '$lib/site';
  import CommandMenu from './CommandMenu.svelte';
  import MobileNav from './MobileNav.svelte';
  import ModeToggle from './ModeToggle.svelte';

  // "Docs" covers every docs page that another header link does not.
  const active = $derived(site.nav.findLast((item) => page.url.pathname.startsWith(item.href))?.href);
</script>

<header class="sticky top-0 z-50 w-full bg-background">
  <div class="container-wrapper px-6">
    <div class="flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:h-4!">
      <MobileNav class="flex lg:hidden" />
      <a href="/" class="hidden items-center gap-2 px-2 font-semibold lg:flex">
        <span class="flex size-6 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground" aria-hidden="true">S</span>
        <span>{site.name}</span>
      </a>
      <nav aria-label="Main" class="hidden items-center lg:flex">
        {#each site.nav as item (item.href)}
          <a href={item.href} data-active={active === item.href} class="rounded-md px-2.5 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground data-[active=true]:text-foreground">{item.label}</a>
        {/each}
      </nav>
      <div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
        <div class="flex w-full flex-1 md:w-auto md:flex-none">
          <CommandMenu />
        </div>
        <Separator orientation="vertical" class="ml-2 hidden lg:block" />
        <a href={site.github} target="_blank" rel="noreferrer" class="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted" aria-label="GitHub">
          <svg viewBox="0 0 24 24" class="size-4" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" /></svg>
        </a>
        <Separator orientation="vertical" />
        <ModeToggle />
      </div>
    </div>
  </div>
</header>
