<script lang="ts">
  import { Toaster } from '$registry/bases/base/ui/toast';
  import { site } from '$lib/site';
  let { data } = $props();

  // The docs page around the preview iframe writes the theme; follow it without a reload.
  function syncTheme(event: StorageEvent) {
    if (event.key === 'theme') document.documentElement.classList.toggle('dark', event.newValue === 'dark');
  }
</script>

<svelte:window onstorage={syncTheme} />

<svelte:head>
  <title>{data.block.name} - {site.name}</title>
  <meta name="description" content={data.block.description} />
</svelte:head>

<div class="bg-background">
  <data.component />
</div>
<!-- Upstream's root layout holds a Toaster, so blocks call toast without one of their own. -->
<Toaster />
