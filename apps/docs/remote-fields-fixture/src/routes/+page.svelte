<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { Button as BaseButton } from '@sveltery/base/button';
  import { Button } from '@sveltery/ui/button';
  import { Textarea } from '@sveltery/ui/textarea';
  import { probe } from './form.remote';
  const current = probe.for('core');
  let mode = $state('default');
  const attrs = $derived(mode === 'retain' ? current.enhance(async ({ submit }) => { await submit(); }) : mode === 'reset' ? current.enhance(async ({ submit, element }) => { if (await submit()) element.reset(); }) : current);
  let hydrated = $state(false);
  let show = $state(true);
  let textarea = $state<HTMLTextAreaElement | null>(null);
  let submitButton = $state<HTMLButtonElement | null>(null);
  let attached = $state(0);
  let detached = $state(0);
  let tags = $state<string[]>([]);
  let events = $state<{ type: string; tag: string; id: string; native: boolean; trusted: boolean }[]>([]);
  let formData = $state<[string, string | File][]>([]);
  function attachment(node: HTMLElement) {
    untrack(() => { attached++; tags.push(node.tagName); });
    return () => { untrack(() => detached++); };
  }
  function record(event: Event) {
    if (event.target instanceof HTMLElement) events.push({ type: event.type, tag: event.target.tagName, id: event.target.id, native: event instanceof Event, trusted: event.isTrusted });
  }
  function submitted(event: SubmitEvent) {
    if (event.currentTarget instanceof HTMLFormElement) formData = [...new FormData(event.currentTarget, event.submitter)];
  }
  onMount(() => { hydrated = true; });
</script>
<svelte:head><title>Direct remote-field spread fixture</title></svelte:head>
<main data-hydrated={hydrated}>
  <h1>Direct remote-field spread fixture</h1>
  {#if show}
    <form id="probe" {...attrs} oninput={record} onchange={record} onsubmit={submitted}>
      <label for="native-text">Native text</label>
      <textarea id="native-text" {...current.fields.nativeText.as('text', 'Draft')}></textarea>
      <label for="ui-text">UI text</label>
      <Textarea id="ui-text" {...current.fields.text.as('text', 'Draft')} bind:ref={textarea} {@attach attachment} />
      <label for="empty-text">UI text without a default</label>
      <Textarea id="empty-text" {...current.fields.emptyText.as('text')} />
      <button id="native-submit" {...current.fields.action.as('submit', 'native')}>Submit native</button>
      <BaseButton id="base-submit" {...current.fields.baseAction.as('submit', 'base')}>Submit base</BaseButton>
      <Button id="ui-submit" {...current.fields.uiAction.as('submit', 'ui')} bind:ref={submitButton} {@attach attachment}>Submit UI</Button>
      <button id="reset" type="reset">Reset</button>
    </form>
  {/if}
  <button id="mode-default" type="button" onclick={() => mode = 'default'}>Default enhancement</button>
  <button id="mode-retain" type="button" onclick={() => mode = 'retain'}>Retain enhancement</button>
  <button id="mode-reset" type="button" onclick={() => mode = 'reset'}>Explicit reset enhancement</button>
  <button id="field-set" type="button" onclick={() => { current.fields.nativeText.set('Individual native'); current.fields.text.set('Individual UI'); }}>Set individual fields</button>
  <button id="collection-set" type="button" onclick={() => current.fields.set({ nativeText: 'Collection native', text: 'Collection UI', emptyText: 'Collection empty' })}>Set collection</button>
  <button id="remove" type="button" onclick={() => show = false}>Remove form</button>
  <pre id="values">{JSON.stringify(current.fields.value())}</pre>
  <pre id="issues">{JSON.stringify(current.fields.allIssues())}</pre>
  <pre id="text-issues">{JSON.stringify(current.fields.text.issues())}</pre>
  <pre id="result">{JSON.stringify(current.result ?? null)}</pre>
  <output id="pending">{current.pending}</output>
  <pre id="form-data">{JSON.stringify(formData)}</pre>
  <pre id="lifecycle">{JSON.stringify({ attached, detached, tags, textarea: textarea?.tagName ?? null, submitButton: submitButton?.tagName ?? null })}</pre>
  <pre id="events">{JSON.stringify(events)}</pre>
</main>
