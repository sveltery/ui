<script lang="ts">
  import './style-registry.css';
  import { IconLibraryProvider } from '$registry/bases/base/ui/icons';
  import { Toaster } from '$registry/bases/base/ui/toast';
  import { prepareDesignSystem, syncMenuColor } from '$lib/create/preview/design-system';
  import { parsePreviewMessage, parsePreviewParams } from '$lib/create/preview/message';
  import { site } from '$lib/site';
  import { DEFAULT_PRESET_CONFIG } from '../../../../../../packages/cli/src/preset/index.js';

  let { data } = $props();
  const browser = typeof window !== 'undefined';

  if (browser) {
    // Focus inside the frame must not scroll the Create page around it.
    const focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (options) {
      focus.call(this, { ...options, preventScroll: true });
    };
  }

  // The page is prerendered without a query, so the config is read in the browser.
  let config = $state.raw(browser ? parsePreviewParams(new URLSearchParams(location.search)) : DEFAULT_PRESET_CONFIG);
  let ready = $state(false);
  const menuColor = $derived(config.menuColor);

  $effect(() => {
    let current = true;
    prepareDesignSystem(config).then((apply) => {
      if (!current) return;
      apply();
      ready = true;
    });
    return () => (current = false);
  });

  $effect(() => syncMenuColor(menuColor));

  function receive(event: MessageEvent) {
    config = parsePreviewMessage(event) ?? config;
  }

  // The Create page around the iframe writes the theme; follow it without a reload.
  function syncTheme(event: StorageEvent) {
    if (event.key === 'theme') document.documentElement.classList.toggle('dark', event.newValue === 'dark');
  }
</script>

<svelte:window onmessage={receive} onstorage={syncTheme} />

<svelte:head>
  <title>{data.block.name} - {site.name}</title>
</svelte:head>

<div class="relative bg-background">
  {#if ready}
    <IconLibraryProvider library={config.iconLibrary}>
      <data.component />
    </IconLibraryProvider>
  {/if}
</div>
<Toaster />

<style>
  :global(html) {
    scrollbar-width: none;
  }
  :global(html::-webkit-scrollbar) {
    display: none;
  }
</style>
