<script lang="ts">
  import SiteFooter from '$lib/components/site/SiteFooter.svelte';
  import SiteHeader from '$lib/components/site/SiteHeader.svelte';
  import { Toaster } from '@sveltery/ui/sonner';
  import { sonnerPosition } from '../../../examples/base/sonner/position.svelte.js';
  let { children } = $props();
</script>

<div data-slot="layout" class="relative z-10 flex min-h-svh flex-col bg-background">
  <SiteHeader />
  <main class="flex min-h-0 flex-1 flex-col">{@render children()}</main>
  <SiteFooter />
</div>
<Toaster position={sonnerPosition.value} />
