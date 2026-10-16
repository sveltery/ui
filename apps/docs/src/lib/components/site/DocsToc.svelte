<script lang="ts">
  import type { TocItem } from '$lib/docs/types';

  let { toc }: { toc: TocItem[] } = $props();
  let activeId = $state<string>();

  // Highlight the heading nearest the top of the viewport, as upstream's useActiveItem does.
  $effect(() => {
    activeId = undefined;
    const headings = toc.map((item) => document.getElementById(item.url.slice(1))).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) activeId = entry.target.id;
      },
      { rootMargin: '0% 0% -80% 0%' },
    );
    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  });
</script>

{#if toc.length}
  <nav aria-label="On this page" class="flex flex-col gap-2 p-4 pt-0 text-sm">
    <p class="h-6 bg-background text-xs font-medium text-muted-foreground">On This Page</p>
    {#each toc as item (item.url)}
      <a
        href={item.url}
        data-active={item.url === `#${activeId}`}
        data-depth={item.depth}
        class="text-[0.8rem] text-muted-foreground no-underline transition-colors hover:text-foreground data-[active=true]:font-medium data-[active=true]:text-foreground data-[depth=3]:pl-4 data-[depth=4]:pl-6"
      >
        {item.title}
      </a>
    {/each}
  </nav>
{/if}
