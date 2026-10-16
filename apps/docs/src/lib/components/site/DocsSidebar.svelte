<script lang="ts">
  import { page } from '$app/state';
  import { restoreSidebarScroll, restoreSidebarScrollScript, SIDEBAR_SCROLL_KEY } from '$lib/docs/sidebar-scroll';
  import type { DocPage, NavSection } from '$lib/docs/types';

  let { nav, sections }: { nav: NavSection[]; sections: DocPage[] } = $props();

  let content = $state<HTMLElement>();

  const groups = $derived(nav.map((section) => ({ title: section.title, pages: section.pages.filter((item) => item.href !== '/docs') })));
  const sectionActive = (href: string) => (href === '/docs' ? page.url.pathname === href : page.url.pathname.startsWith(href));

  function save() {
    try {
      sessionStorage.setItem(SIDEBAR_SCROLL_KEY, JSON.stringify({ pathname: location.pathname, scrollTop: content?.scrollTop ?? 0 }));
    } catch {
      // Storage can be blocked, as in some private windows; the sidebar then keeps no position.
    }
  }

  $effect(() => {
    void page.url.pathname;
    if (!content) return;
    restoreSidebarScroll(content);
    save();
  });

  const itemClass =
    'peer/menu-button relative flex h-[30px] w-fit items-center gap-2 overflow-visible rounded-md border border-transparent p-2 text-left text-[0.8rem] font-medium ring-sidebar-ring outline-hidden transition-[width,height,padding] after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:border-accent data-[active=true]:bg-accent data-[active=true]:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0';
  const labelClass = 'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted-foreground';
</script>

{#snippet item(href: string, title: string, active: boolean)}
  <li data-slot="sidebar-menu-item" class="group/menu-item relative">
    <a {href} data-slot="sidebar-menu-button" data-active={active} aria-current={page.url.pathname === href ? 'page' : undefined} class={itemClass}>
      <span class="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent"></span>
      {title}
    </a>
  </li>
{/snippet}

<aside
  data-slot="sidebar"
  class="sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-10rem)] w-72 flex-col overflow-hidden overscroll-none text-sidebar-foreground [--sidebar-menu-width:--spacing(56)] lg:flex"
>
  <div class="absolute top-12 right-2 bottom-0 hidden h-full w-px bg-[linear-gradient(to_bottom,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)] lg:flex"></div>
  <nav
    bind:this={content}
    aria-label="Docs"
    data-slot="sidebar-content"
    data-docs-sidebar-content
    class="no-scrollbar flex min-h-0 w-(--sidebar-menu-width) flex-1 scroll-fade flex-col gap-2 overflow-auto overflow-x-hidden pl-2.5"
    onscroll={save}
  >
    <div data-slot="sidebar-group" class="relative flex w-full min-w-0 flex-col p-2 pt-12">
      <div data-slot="sidebar-group-label" class={labelClass}>Sections</div>
      <ul data-slot="sidebar-menu" class="flex w-full min-w-0 flex-col gap-1 text-sm">
        {#each sections as section (section.href)}
          {@render item(section.href, section.title, sectionActive(section.href))}
        {/each}
      </ul>
    </div>
    {#each groups as group (group.title)}
      <div data-slot="sidebar-group" class="relative flex w-full min-w-0 flex-col p-2">
        <div data-slot="sidebar-group-label" class={labelClass}>{group.title}</div>
        <ul data-slot="sidebar-menu" class="flex w-full min-w-0 flex-col gap-0.5 text-sm">
          {#each group.pages as entry (entry.href)}
            {@render item(entry.href, entry.title, page.url.pathname === entry.href)}
          {/each}
        </ul>
      </div>
    {/each}
  </nav>
  {@html restoreSidebarScrollScript}
</aside>
