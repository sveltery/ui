<script lang="ts">
  import { onMount } from 'svelte';
  import AvatarProbe from '../../../examples/base/AvatarProbe.svelte';
  import AvatarRenderProbe from '../../../examples/base/AvatarRenderProbe.svelte';
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>
<main class="p-8" data-hydrated={hydrated}><AvatarProbe /><AvatarRenderProbe /></main>
