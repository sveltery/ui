<script lang="ts">
  import { page } from '$app/state';
  import { categories } from '$blocks/registry';

  const links = [{ name: 'Featured', slug: '', hidden: false }, ...categories].filter((category) => !category.hidden);
</script>

<nav aria-label="Blocks" class="relative overflow-hidden">
  <div class="no-scrollbar flex items-center overflow-x-auto">
    {#each links as category (category.slug)}
      {@const href = category.slug ? `/blocks/${category.slug}` : '/blocks'}
      <a
        {href}
        data-active={page.url.pathname === href}
        aria-current={page.url.pathname === href ? 'page' : undefined}
        class="flex h-7 shrink-0 items-center justify-center px-4 text-center text-base font-medium text-muted-foreground transition-colors hover:text-primary data-[active=true]:text-primary">{category.name}</a
      >
    {/each}
  </div>
</nav>
