<script lang="ts">
  import { page } from '$app/state';
  import type { NavSection } from '$lib/docs/types';

  const components = $derived((page.data.nav as NavSection[]).find((section) => section.title === 'Components')?.pages ?? []);
</script>

<div data-not-typeset class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
  {#each components as component (component.href)}
    <a href={component.href} class="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base">{component.title}</a>
  {/each}
</div>
