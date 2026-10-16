<script lang="ts">
  import SiteFooter from '$lib/components/site/SiteFooter.svelte';
  import SiteHeader from '$lib/components/site/SiteHeader.svelte';
  import { Toaster } from '@sveltery/ui/toast';
  let { children } = $props();
</script>

<div data-slot="layout" class="group/layout relative z-10 flex min-h-svh flex-col bg-background has-data-[slot=designer]:h-svh has-data-[slot=designer]:overflow-hidden">
  <SiteHeader />
  <main class="flex min-h-0 flex-1 flex-col">{@render children()}</main>
  <SiteFooter />
</div>
<Toaster />
