<script lang="ts">
  import { page } from '$app/state';
  import DialogExample from '../../../examples/base/DialogExample.svelte';
</script>
<svelte:head><title>Dialog — Sveltery UI</title></svelte:head>
<DialogExample scenario={page.url.searchParams.get('scenario') ?? 'ordinary'} />
