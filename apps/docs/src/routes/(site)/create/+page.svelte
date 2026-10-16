<!-- Port of shadcn's apps/v4/app/(app)/(create)/create/page.tsx at af983e8. -->
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { afterNavigate, goto } from '$app/navigation';
  import Customizer from '$lib/create/Customizer.svelte';
  import { Designer, setDesigner } from '$lib/create/designer.svelte';
  import Preview from '$lib/create/Preview.svelte';
  import { site } from '$lib/site';

  let { data } = $props();

  const designer = setDesigner(new Designer());
  // The page is prerendered without a query, so the config is read in the browser before anything shows.
  let ready = $state(false);
  // The first write after a navigation only fills in the URL it landed on, so it replaces instead of adding an entry.
  let landed = true;

  // A link or Back to another `?preset=` keeps this component, so every navigation reads the URL again.
  afterNavigate(({ to }) => {
    // The URL writes below come back here too; only a URL that differs from the config is a new place.
    if (to && to.url.search !== designer.search(to.url.search)) {
      designer.load(to.url.searchParams);
      landed = true;
    }
    ready = true;
  });
  onDestroy(() => designer.destroy());

  // The URL follows the config, so a copied link reopens the same setup. Each change is a history entry, as upstream.
  $effect(() => {
    const search = designer.search(location.search);
    if (!ready) return;
    if (location.search !== search) goto(search, { replace: landed, shallow: true });
    landed = false;
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
