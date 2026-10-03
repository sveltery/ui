<script lang="ts">
  // Selected immutable Basic body and genuine Example helpers. See alert-sources.json / MIT notices.
  import { onMount } from 'svelte';
  import { Alert, AlertTitle, AlertDescription } from '@sveltery/ui/alert';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>
<ExampleWrapper class="lg:grid-cols-1" data-alert-gallery="true" data-hydrated={hydrated}>
  <Example title="Basic">
    <div class="mx-auto flex w-full max-w-lg flex-col gap-4">
      <Alert><AlertTitle>Success! Your changes have been saved.</AlertTitle></Alert>
      <Alert><AlertTitle>Success! Your changes have been saved.</AlertTitle><AlertDescription>This is an alert with title and description.</AlertDescription></Alert>
      <Alert><AlertDescription>This one has a description only. No title. No icon.</AlertDescription></Alert>
    </div>
  </Example>
</ExampleWrapper>
