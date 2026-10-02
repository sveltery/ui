<script lang="ts">
  // Supplemental native selector witnesses; these SVGs/buttons do not port IconPlaceholder/Badge example compositions.
  import { onMount, untrack } from 'svelte';
  import { Alert, AlertTitle, AlertDescription, AlertAction } from '@sveltery/ui/alert';
  let hydrated = $state(false);
  let changed = $state(false);
  let show = $state(true);
  let clicks = $state(0);
  let replaced = $state(false);
  let refs = $state<(HTMLDivElement | null | undefined)[]>([undefined, null, undefined, null]);
  let attachments = $state(0);
  let cleanups = $state(0);
  function attachment(node: HTMLDivElement) {
    untrack(() => attachments++);
    node.dataset.probed = 'alert';
    return () => untrack(() => cleanups++);
  }
  const initialAttachment = (node: HTMLDivElement) => attachment(node);
  const replacementAttachment = (node: HTMLDivElement) => attachment(node);
  const attach = $derived(replaced ? replacementAttachment : initialAttachment);
  onMount(() => { hydrated = true; });
</script>
<main data-alert-probe data-hydrated={hydrated} class="p-8">
  <h1>Native Alert acceptance probe</h1>
  <button type="button">Before alert</button>
  <section data-testid="composition">
    {#if show}
      <Alert id="probe-alert" variant={changed ? 'destructive' : 'default'} role={changed ? 'status' : 'alert'} class={changed ? ['rounded-none', { 'text-lg': true }] : undefined} title={changed ? 'Updated & <alert>' : 'Initial & <alert>'} data-custom={changed ? 'updated' : 'initial'} bind:ref={refs[0]} {@attach attach}>
        <AlertTitle id="probe-title" bind:ref={refs[1]} {@attach attach}>{changed ? 'Updated title' : 'Initial title'} <a href="#details">Details</a></AlertTitle>
        <AlertDescription id="probe-description" bind:ref={refs[2]} {@attach attach}><p>First description paragraph.</p><p>{changed ? 'Updated message' : 'Initial message'} <a href="#help">Help</a></p></AlertDescription>
        <AlertAction id="probe-action" bind:ref={refs[3]} {@attach attach} onclick={() => clicks++}><button type="button">Undo</button></AlertAction>
      </Alert>
    {/if}
  </section>
  <button type="button">After alert</button>
  <section data-testid="selectors" class="grid gap-4">
    <Alert data-testid="plain"><AlertTitle>Plain title</AlertTitle><AlertDescription>Plain description</AlertDescription></Alert>
    <Alert data-testid="direct-svg"><svg aria-hidden="true" viewBox="0 0 16 16"><path d="M2 8h12" /></svg><AlertTitle>Direct SVG title</AlertTitle><AlertDescription>Direct SVG description</AlertDescription></Alert>
    <Alert data-testid="sized-svg"><svg class="size-6" aria-hidden="true" viewBox="0 0 16 16"><path d="M2 8h12" /></svg><AlertTitle>Sized SVG title</AlertTitle></Alert>
    <Alert data-testid="nested-svg"><span><svg aria-hidden="true" viewBox="0 0 16 16"><path d="M2 8h12" /></svg></span><AlertTitle>Nested SVG title</AlertTitle></Alert>
    <Alert variant="destructive" data-testid="destructive"><AlertTitle>Destructive title</AlertTitle><AlertDescription>Destructive description</AlertDescription></Alert>
    <Alert variant={null} data-testid="null-variant"><AlertTitle>Null variant</AlertTitle><AlertDescription>Null description</AlertDescription></Alert>
    <Alert data-testid="nested-action"><div><AlertAction>Nested action</AlertAction></div><AlertTitle>Nested action title</AlertTitle></Alert>
    <Alert data-testid="overridden-slots"><AlertTitle data-slot="consumer-title">Overridden title</AlertTitle><AlertDescription data-slot="consumer-description">Overridden description</AlertDescription><AlertAction data-slot="consumer-action">Overridden action</AlertAction></Alert>
    <Alert variant="destructive" data-testid="destructive-nested"><div><AlertDescription>Nested destructive description</AlertDescription></div><AlertDescription data-slot="consumer-description">Overridden destructive description</AlertDescription></Alert>
    <Alert data-testid="long-text"><AlertTitle>This is a long supplemental native title that wraps across multiple lines while preserving the pinned classes and width.</AlertTitle><AlertDescription>This is a long supplemental native description for comparing wrapping and spacing at desktop and mobile viewport widths.</AlertDescription></Alert>
  </section>
  <button type="button" onclick={() => changed = !changed}>Update alert</button>
  <button type="button" onclick={() => show = !show}>{show ? 'Remove alert' : 'Restore alert'}</button>
  <button type="button" onclick={() => replaced = !replaced}>Swap attachments</button>
  <output data-testid="probe-state">{JSON.stringify({ changed, clicks, replaced, refs: refs.map(ref => ref === undefined ? 'undefined' : ref?.id ?? null), attachments, cleanups })}</output>
</main>
