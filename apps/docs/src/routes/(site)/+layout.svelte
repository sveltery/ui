<script lang="ts">
  import SiteFooter from '$lib/components/site/SiteFooter.svelte';
  import SiteHeader from '$lib/components/site/SiteHeader.svelte';
  import { page } from '$app/state';
  import { Toaster } from '$registry/bases/base/ui/toast';
  let { children } = $props();

  // The Create and Typeset pages fill the viewport. A `:has()` selector here restyles every page on each hydration change, so the route decides.
  const designer = $derived(page.route.id === '/(site)/create' || page.route.id === '/(site)/typeset');
  // Docs pages end with their own pager, so the footer is left out there, as upstream.
  const docs = $derived(page.route.id?.startsWith('/(site)/docs'));
</script>

<div data-slot="layout" class={['group/layout relative z-10 flex min-h-svh flex-col bg-background', designer && 'h-svh overflow-hidden']}>
  <SiteHeader />
  <main class="flex min-h-0 flex-1 flex-col">{@render children()}</main>
  {#if !designer && !docs}
    <SiteFooter />
  {/if}
</div>
<Toaster />
