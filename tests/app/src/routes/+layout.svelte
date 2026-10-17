<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { syncMenuColor } from '../../../../apps/docs/src/lib/create/preview/design-system';
  let { children } = $props();
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
  // The fixtures render raw tokens like the Create preview, so they take the default menu color the same way.
  $effect(() => syncMenuColor('default'));
</script>
<main data-hydrated={hydrated}>{@render children()}</main>
