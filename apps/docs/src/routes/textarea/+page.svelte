<script lang="ts">
  import { onMount } from 'svelte';
  import TextareaExample from '../../../examples/base/TextareaExample.svelte';
  import { Textarea } from '@sveltery/ui/textarea';
  import { createAttachmentKey } from 'svelte/attachments';
  let hydrated = $state(false);
  let value = $state('Initial');
  let unset = $state<string | undefined>();
  let unsetRef = $state<HTMLTextAreaElement>();
  let ref = $state<HTMLTextAreaElement | null>(null);
  let inputs = $state(0);
  let changes = $state(0);
  let submitted = $state('');
  let visible = $state(true);
  let attached = 0;
  let detached = 0;
  let lifecycle = $state('');
  const attachment = { [createAttachmentKey()]: (node: HTMLTextAreaElement) => { attached++; node.dataset.attached = 'true'; return () => { detached++; }; } };
  onMount(() => { hydrated = true; });
</script>
<main class="p-8" data-hydrated={hydrated}>
  <TextareaExample />
  <form id="message-form" onsubmit={event => { event.preventDefault(); submitted = JSON.stringify([...new FormData(event.currentTarget)]); }}>
    <label for="message">Message form</label>
    {#if visible}<Textarea id="message" name="message" bind:value bind:ref={ref} {...attachment} aria-describedby="message-description" required minlength={2} maxlength={40} oninput={() => inputs++} onchange={() => changes++} />{/if}
    <p id="message-description">Form description</p>
    <Textarea id="draft" name="draft" aria-label="Draft" defaultValue="Draft" />
    <Textarea name="ignored" aria-label="Ignored" value="Ignored" disabled />
    <button type="submit">Submit</button><button type="reset">Reset</button>
  </form>
  <Textarea id="external" form="message-form" name="external" aria-label="External" defaultValue="Outside" />
  <Textarea id="readonly" aria-label="Readonly" readonly value="Read only" />
  <button onclick={() => { value = 'Updated'; }}>Update value</button>
  <button onclick={() => { visible = false; }}>Remove</button>
  <button onclick={() => { lifecycle = JSON.stringify({ attached, detached, ref: ref?.id ?? null }); }}>Inspect lifecycle</button>
  <Textarea data-testid="initially-undefined" aria-label="Initially undefined" bind:value={unset} bind:ref={unsetRef} defaultValue="Unset draft" />
  <output data-testid="unset-state">{JSON.stringify({ value: unset, ref: unsetRef?.tagName })}</output>
  <output data-testid="state">{JSON.stringify({ value, inputs, changes, ref: ref?.id ?? null })}</output>
  <output data-testid="submitted">{submitted}</output><output data-testid="lifecycle">{lifecycle}</output>
</main>
