<script lang="ts">
  import { createAttachmentKey } from 'svelte/attachments';
  import { Textarea } from '../../apps/docs/registry/bases/base/ui/textarea/index.js';
  let value = $state('Initial');
  let ref = $state<HTMLTextAreaElement | null>(null);
  let visible = $state(true);
  const calls: string[] = [];
  let attached = 0;
  let detached = 0;
  const attachment = { [createAttachmentKey()]: (node: HTMLTextAreaElement) => { attached++; node.dataset.attached = 'true'; return () => { detached++; }; } };
  export function snapshot() { return { value, ref, calls, attached, detached }; }
  export function setValue(next: string) { value = next; }
  export function remove() { visible = false; }
</script>
<form id="message-form">
  {#if visible}<Textarea id="bound" name="message" bind:value bind:ref {...attachment} oninput={event => calls.push(`input:${event.currentTarget.value}`)} onchange={event => calls.push(`change:${event.currentTarget.value}`)} />{/if}
  <Textarea id="uncontrolled" name="draft" defaultValue="Draft" />
  <Textarea id="disabled" name="ignored" value="Ignored" disabled />
</form>
