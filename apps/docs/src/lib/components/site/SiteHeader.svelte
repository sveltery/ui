<script lang="ts">
  import { page } from '$app/state';
  import { Separator } from '$registry/bases/base/ui/separator';
  import { buttonVariants } from '$registry/bases/base/ui/button';
  import { cn } from 'cn';
  import { site } from '$lib/site';
  import CommandMenu from './CommandMenu.svelte';
  import GitHubLink from './GitHubLink.svelte';
  import MobileNav from './MobileNav.svelte';
  import ModeToggle from './ModeToggle.svelte';

  const designer = $derived(page.route.id === '/(site)/create');
</script>

<header class="sticky top-0 z-50 w-full bg-background">
  <div class={['container-wrapper px-6', designer && 'max-w-none']}>
    <div class="flex h-(--header-height) items-center **:data-[slot=separator]:h-4! **:data-[slot=separator]:self-center">
      <MobileNav class="flex lg:hidden" />
      <nav aria-label="Main" class="hidden items-center gap-0 lg:flex">
        {#each site.nav as item (item.href)}
          <a
            href={item.href}
            data-active={page.url.pathname === item.href}
            class="relative inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:hover:bg-accent/50"
          >
            {item.label}
          </a>
        {/each}
      </nav>
      <div class="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
        <div class="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
          <CommandMenu />
        </div>
        <Separator orientation="vertical" class="ml-2 hidden lg:block" />
        <GitHubLink />
        <Separator orientation="vertical" />
        <ModeToggle />
        {#if !designer}
          <div class="flex items-center gap-2">
            <Separator orientation="vertical" />
            <a href="/create" class={cn(buttonVariants({ size: 'sm' }), 'h-[31px] rounded-lg')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4V20M20 12H4" /></svg>
              New
            </a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</header>
