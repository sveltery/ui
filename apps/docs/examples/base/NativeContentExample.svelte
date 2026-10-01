<script lang="ts">
  import { onMount } from 'svelte';
  import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@sveltery/ui/dialog';
  let { kind = 'summary' }: { kind?: 'summary' | 'empty' | 'plaintext-only' } = $props();
  // HTML accepts the empty value; Svelte's attribute union omits it. The emitted value stays empty.
  const emptyContentEditable = '' as 'true';
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>
<main data-hydrated={hydrated}>
  <Dialog>
    <DialogTrigger>Open native content</DialogTrigger>
    <DialogContent showCloseButton={false}>
      <DialogTitle>Native content</DialogTitle>
      <DialogDescription>Tab from Close to the native interactive content, then back to Close.</DialogDescription>
      <DialogClose>Close</DialogClose>
      {#if kind === 'summary'}
        <details open>
          <summary data-testid="native-target">More information</summary>
          <p>Details remain open while keyboard focus moves.</p>
        </details>
      {:else}
        <div contenteditable={kind === 'empty' ? emptyContentEditable : 'plaintext-only'} role="textbox" aria-label="Editable note" data-testid="native-target">Edit this note</div>
      {/if}
    </DialogContent>
  </Dialog>
  <button type="button">After native content</button>
</main>
