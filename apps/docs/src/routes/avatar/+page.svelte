<script lang="ts">
  import { onMount } from 'svelte';
  import AvatarExample from '../../../examples/base/AvatarExample.svelte';
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>
<main class="p-8" data-hydrated={hydrated}><AvatarExample /></main>
