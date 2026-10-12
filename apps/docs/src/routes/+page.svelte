<script lang="ts">
  import { resolve } from '$app/paths';
  const pages = ['/alert', '/aspect-ratio', '/avatar', '/button', '/card', '/dialog', '/empty', '/kbd', '/label', '/separator', '/skeleton', '/table', '/textarea'] as const;
</script>
<svelte:head><title>Sveltery UI</title></svelte:head>
<main class="mx-auto max-w-2xl p-8">
  <h1 class="mb-4 text-3xl font-medium">Sveltery UI</h1>
  <ul class="grid gap-2">
    {#each pages as page (page)}
      <li><a class="underline underline-offset-4" href={resolve(page)}>{page.slice(1)}</a></li>
    {/each}
  </ul>
</main>
