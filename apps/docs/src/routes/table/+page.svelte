<script lang="ts">
  import { onMount } from 'svelte';
  import TableExample from '../../../examples/base/TableExample.svelte';
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>

<main class="p-8" data-hydrated={hydrated}>
  <TableExample />
</main>
