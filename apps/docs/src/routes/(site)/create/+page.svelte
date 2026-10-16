<!-- Port of shadcn's apps/v4/app/(app)/(create)/create/page.tsx at af983e8. -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Customizer from '$lib/create/Customizer.svelte';
  import { Designer, setDesigner } from '$lib/create/designer.svelte';
  import Preview from '$lib/create/Preview.svelte';
  import { site } from '$lib/site';

  let { data } = $props();

  const designer = setDesigner(new Designer());
  // The page is prerendered without a query, so the config is read in the browser before anything shows.
  let ready = $state(false);

  onMount(() => {
    designer.load(new URLSearchParams(location.search));
    ready = true;
  });

  // The URL follows the config, so a copied link reopens the same setup.
  $effect(() => {
    const search = designer.search;
    if (ready && location.search !== search) goto(search, { replace: true, shallow: true });
  });
</script>

<svelte:head>
  <title>New Project - {site.name}</title>
  <meta name="description" content="Customize everything. Pick your style, icons, base color, theme, fonts and create your own version of Sveltery UI." />
</svelte:head>

<div class="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden [--customizer-width:--spacing(48)] [--gap:--spacing(4)] md:[--gap:--spacing(6)] 2xl:[--customizer-width:--spacing(56)]">
  <div data-slot="designer" class="flex min-h-0 flex-1 flex-col gap-(--gap) p-(--gap) pt-[calc(var(--gap)*0.25)] md:flex-row-reverse">
    {#if ready}
      <Preview />
      <Customizer cli={data.cli} swatches={data.swatches} />
    {:else}
      <div class="flex-1 animate-pulse rounded-2xl bg-muted"></div>
      <div class="isolate min-h-[151px] w-full animate-pulse self-start rounded-2xl bg-muted md:h-full md:max-h-full md:min-h-0 md:w-(--customizer-width)"></div>
    {/if}
  </div>
</div>
