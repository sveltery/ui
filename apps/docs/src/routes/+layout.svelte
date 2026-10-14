<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  let { children } = $props();

  // Browser tests wait for this before they use interactive controls.
  onMount(() => (document.documentElement.dataset.ready = ''));
</script>

{@render children()}
