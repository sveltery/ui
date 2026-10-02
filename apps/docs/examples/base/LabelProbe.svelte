<script lang="ts">
  // Native controls are supplemental witnesses, not ports of Checkbox/Input or Field.
  import { onMount, untrack } from 'svelte';
  import { Label } from '@sveltery/ui/label';
  let hydrated = $state(false);
  let changed = $state(false);
  let show = $state(true);
  let clicks = $state(0);
  let replaced = $state(false);
  let label = $state<HTMLLabelElement | null>();
  let attachments = $state(0);
  let cleanups = $state(0);
  function attachment(node: HTMLLabelElement) {
    untrack(() => attachments++);
    node.dataset.probed = 'label';
    return () => untrack(() => cleanups++);
  }
  const initialAttachment = (node: HTMLLabelElement) => attachment(node);
  const replacementAttachment = (node: HTMLLabelElement) => attachment(node);
  const attach = $derived(replaced ? replacementAttachment : initialAttachment);
  const tag = $derived(label === undefined ? 'undefined' : label?.tagName ?? null);
  onMount(() => { hydrated = true; });
</script>
<main data-label-probe data-hydrated={hydrated} class="p-8">
  <h1>Native Label acceptance probe</h1>
  <section data-testid="association">
    {#if show}
      <Label id="probe-label" for={changed ? 'probe-second' : 'probe-first'} data-slot={changed ? 'label-override' : 'label'} data-custom={changed ? 'updated' : 'initial'} aria-disabled={changed ? 'true' : undefined} class={changed ? ['gap-4', { 'text-lg': true }] : undefined} style={changed ? 'color: rgb(60, 70, 80)' : 'color: rgb(30, 40, 50)'} bind:ref={label} {@attach attach} onclick={() => clicks++}>{changed ? 'Updated name' : 'Account name'}<span data-testid="label-child">optional</span></Label>
    {/if}
    <input id="probe-first" type="text" />
    <input id="probe-second" type="text" />
  </section>
  <section data-testid="selectors">
    <div class="group" data-disabled="true"><Label data-testid="group-true">Group true</Label></div>
    <div class="group" data-disabled="false"><Label data-testid="group-false">Group false</Label></div>
    <div class="group" data-disabled=""><Label data-testid="group-empty">Group empty</Label></div>
    <div class="group"><Label data-testid="group-missing">Group missing</Label></div>
    <div data-disabled="true"><Label data-testid="no-group">No group class</Label></div>
    <div><input type="text" class="peer" disabled aria-label="Disabled peer" /><Label data-testid="peer-disabled">Disabled peer</Label></div>
    <div><input type="text" class="peer" aria-label="Enabled peer" /><Label data-testid="peer-enabled">Enabled peer</Label></div>
    <div><input type="text" disabled aria-label="No peer class" /><Label data-testid="no-peer">No peer class</Label></div>
    <div><Label data-testid="peer-after">Peer follows label</Label><input type="text" class="peer" disabled aria-label="Following peer" /></div>
    <div><input type="text" class="peer" data-disabled="" aria-label="Data disabled peer" /><Label class="cn-label-aria" data-testid="aria-data-empty">Data disabled aria label</Label><Label data-testid="plain-data-empty">Data disabled plain label</Label></div>
    <div><input type="text" class="peer" data-disabled="false" aria-label="False data disabled peer" /><Label class="cn-label-aria" data-testid="aria-data-false">False data disabled aria label</Label></div>
    <div><input type="text" class="peer" aria-disabled="true" aria-label="Aria disabled peer" /><Label class="cn-label-aria" data-testid="aria-only">Aria attribute only</Label></div>
    <div><input type="text" class="peer" aria-label="Missing data disabled peer" /><Label class="cn-label-aria" data-testid="aria-missing">Missing data disabled</Label></div>
  </section>
  <button type="button" onclick={() => changed = !changed}>Update label</button>
  <button type="button" onclick={() => show = !show}>{show ? 'Remove label' : 'Restore label'}</button>
  <button type="button" onclick={() => replaced = !replaced}>Swap attachments</button>
  <output data-testid="probe-state">{JSON.stringify({ changed, clicks, replaced, tag, attachments, cleanups })}</output>
</main>
