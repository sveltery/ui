<script lang="ts">
  import '../app.css';
  import '$lib/typeset/typeset.css';
  import { onMount } from 'svelte';
  import { TooltipProvider } from '$registry/bases/base/ui/tooltip';
  let { children } = $props();

  // Browser tests wait for this before they use interactive controls.
  onMount(() => (document.documentElement.dataset.ready = ''));
</script>

<TooltipProvider>
  {@render children()}
</TooltipProvider>
