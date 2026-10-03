<script lang="ts">
  import { onMount } from 'svelte';
  import AspectRatioExample from '../../../examples/base/AspectRatioExample.svelte';
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>
<main class="p-8" data-aspect-ratio-gallery data-hydrated={hydrated}><AspectRatioExample /></main>
