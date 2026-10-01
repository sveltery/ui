<script lang="ts">
  import { onMount } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { Textarea } from '@sveltery/ui/textarea';
  let hydrated = $state(false);
  let value = $state('Initial');
  let unset = $state<string | undefined>();
  let unsetRef = $state<HTMLTextAreaElement>();
  let ref = $state<HTMLTextAreaElement | null>(null);
  let inputs = $state(0);
  let changes = $state(0);
  let submitted = $state('');
  let attachments = 0;
  const attached = { [createAttachmentKey()]: (node: HTMLTextAreaElement) => { attachments++; node.dataset.attached = 'true'; } };
  onMount(() => { hydrated = true; });
</script>
<main data-hydrated={hydrated} class="p-8">
  <form onsubmit={event => { event.preventDefault(); submitted = JSON.stringify([...new FormData(event.currentTarget)]); }}>
    <label for="message">Message</label>
    <Textarea id="message" name="message" bind:value bind:ref {...attached} aria-describedby="description" required rows={6} />
    <p id="description">Write a message</p>
    <Textarea id="draft" name="draft" aria-label="Draft" defaultValue="Draft" />
    <Textarea id="disabled" name="ignored" aria-label="Disabled" value="Ignored" disabled />
    <Textarea id="invalid" aria-label="Invalid" aria-invalid="true" />
    <Textarea id="override" aria-label="Override" class="min-h-32 w-64 rounded-none px-6" />
    <button type="submit">Submit</button><button type="reset">Reset</button>
  </form>
  <Textarea data-testid="initially-undefined" aria-label="Initially undefined" bind:value={unset} bind:ref={unsetRef} defaultValue="Unset draft" />
  <output data-testid="unset-state">{JSON.stringify({ value: unset, ref: unsetRef?.tagName })}</output>
  <output data-testid="state">{JSON.stringify({ value, inputs, changes, ref: ref?.id ?? null })}</output>
  <output data-testid="submitted">{submitted}</output>
  <button onclick={() => { submitted = String(attachments); }}>Inspect attachments</button>
</main>
