<script lang="ts">
  import { page } from '$app/state';
  import { site } from '$lib/site';
</script>

<svelte:head>
  <title>{page.status}: {page.status === 404 ? 'This page could not be found.' : page.error?.message} - {site.name}</title>
</svelte:head>

<div class="flex h-svh flex-col items-center justify-center bg-white text-center text-black dark:bg-black dark:text-white">
  <div>
    <h1 class="mr-5 inline-block border-r border-black/30 dark:border-white/30 pr-[23px] align-top text-2xl leading-[49px] font-medium">{page.status}</h1>
    <div class="inline-block">
      <h2 class="m-0 text-sm leading-[49px] font-normal">{page.status === 404 ? 'This page could not be found.' : page.error?.message}</h2>
    </div>
  </div>
</div>
