<script lang="ts">
  import SiteFooter from '$lib/components/site/SiteFooter.svelte';
  import SiteHeader from '$lib/components/site/SiteHeader.svelte';
  import { onMount } from 'svelte';
  let { children } = $props();

  // Browser tests wait for this before they use interactive controls.
  onMount(() => (document.documentElement.dataset.ready = ''));
</script>

<div data-slot="layout" class="relative z-10 flex min-h-svh flex-col bg-background">
  <SiteHeader />
  <main class="flex min-h-0 flex-1 flex-col">{@render children()}</main>
  <SiteFooter />
</div>
