<script lang="ts">
  // Basic function contents at the pin; native Example scaffold. See alert-sources.json / MIT notices.
  import { onMount } from 'svelte';
  import { Alert, AlertTitle, AlertDescription } from '@sveltery/ui/alert';
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>
<section data-alert-gallery="true" data-hydrated={hydrated} class="grid gap-6">
  <section><h2>Basic</h2>
    <div class="mx-auto flex w-full max-w-lg flex-col gap-4">
      <Alert><AlertTitle>Success! Your changes have been saved.</AlertTitle></Alert>
      <Alert><AlertTitle>Success! Your changes have been saved.</AlertTitle><AlertDescription>This is an alert with title and description.</AlertDescription></Alert>
      <Alert><AlertDescription>This one has a description only. No title. No icon.</AlertDescription></Alert>
    </div>
  </section>
</section>
