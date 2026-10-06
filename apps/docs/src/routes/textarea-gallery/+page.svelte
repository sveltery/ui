<script lang="ts">
  import { onMount } from 'svelte';
  import TextareaExample from '../../../examples/base/TextareaExample.svelte';
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>
<main class="p-8" data-hydrated={hydrated}><TextareaExample /></main>
