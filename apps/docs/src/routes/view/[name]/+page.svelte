<script lang="ts">
  import { Toaster as Sonner } from '$registry/bases/base/ui/sonner';
  import { Toaster } from '$registry/bases/base/ui/toast';
  import { mode } from '$lib/theme.svelte';
  import { site } from '$lib/site';
  let { data } = $props();

  // The docs page around the preview iframe writes the theme; follow it without a reload.
  function syncTheme(event: StorageEvent) {
    if (event.key !== 'theme') return;
    mode.current = event.newValue === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', mode.current === 'dark');
  }
</script>

<svelte:window onstorage={syncTheme} />

<svelte:head>
  <title>{data.block.name} - {site.name}</title>
  <meta name="description" content={data.block.description} />
</svelte:head>

<div class="bg-background *:data-[slot=card]:has-[[data-slot=chart]]:shadow-none">
  <data.component />
</div>
<!-- Upstream's root layout holds both toasters, so blocks call toast without one of their own. -->
<Sonner position="top-center" theme={mode.current} />
<Toaster />
