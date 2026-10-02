<script lang="ts">
  import { createAttachmentKey } from 'svelte/attachments';
  import { Input } from '../../apps/docs/registry/bases/base/ui/input/index.js';
  let { policy = 'accept' }: { policy?: 'accept' | 'reject' | 'rewrite' } = $props();
  let value = $state('Initial');
  let ref = $state<HTMLInputElement | null>();
  let nullRef = $state<HTMLInputElement | null>(null);
  let visible = $state(true);
  let swapped = $state(false);
  let attached = 0; let detached = 0;
  const calls: string[] = [];
  function attachment(node: HTMLInputElement) { attached++; node.dataset.attached = 'true'; return () => { detached++; }; }
  const initial = (node: HTMLInputElement) => attachment(node);
  const replacement = (node: HTMLInputElement) => attachment(node);
  const key = createAttachmentKey();
  const spread = $derived({ [key]: swapped ? replacement : initial });
  export function snapshot() { return { value, ref, nullRef, attached, detached, calls: [...calls] }; }
  export function update(next: string) { value = next; }
  export function swap() { swapped = !swapped; }
  export function remove() { visible = false; }
  export function show() { visible = true; }
</script>
<form id="input-form">
  {#if visible}<Input id="controlled-input" name="value" {value} bind:ref {...spread} oninput={event => { const next = event.currentTarget.value; calls.push(`input:${next}`); if (policy === 'accept') value = next; if (policy === 'rewrite') value = next.toUpperCase(); }} onchange={event => calls.push(`change:${event.currentTarget.value}`)} />{/if}
  <Input id="draft-input" name="draft" defaultValue="Draft" bind:ref={nullRef} />
</form>
<Input id="external-input" form="input-form" name="external" defaultValue="Outside" />
