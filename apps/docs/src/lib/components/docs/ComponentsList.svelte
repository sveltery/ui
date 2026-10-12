<script lang="ts">
  import { page } from '$app/state';
  import type { NavSection } from '$lib/docs/types';

  const components = $derived((page.data.nav as NavSection[]).find((section) => section.title === 'Components')?.pages ?? []);
</script>

<div data-not-typeset class="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
  {#each components as component (component.href)}
    <a href={component.href} class="text-lg font-medium underline-offset-4 hover:underline md:text-base">{component.title}</a>
  {/each}
</div>
