<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@sveltery/ui/dialog';
  let { scenario = 'ordinary' }: { scenario?: string } = $props();
  let open = $state(untrack(() => scenario === 'initial'));
  let hydrated = $state(false);
  let cancelNext = $state(false);
  let show = $state(true);
  let completions = $state<boolean[]>([]);
  const buttonClass = 'cn-button cn-button-variant-outline cn-button-size-default inline-flex items-center justify-center';
  onMount(() => { hydrated = true; });
</script>
<main class="mx-auto max-w-2xl p-8" data-hydrated={hydrated}>
  <h1 class="mb-4 text-2xl font-medium">Dialog</h1>
  <p class="mb-6 text-muted-foreground">Update your profile, then return to the page.</p>
  <button type="button" class={buttonClass}>Before</button>
  {#if show}
    <Dialog bind:open onOpenChange={(_next, details) => { if (cancelNext) { details.cancel(); cancelNext = false; } }} onOpenChangeComplete={next => completions.push(next)}>
      <DialogTrigger class={buttonClass} data-testid="trigger">Edit profile</DialogTrigger>
      <DialogContent showCloseButton={scenario !== 'footer' && scenario !== 'no-close'}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Choose Save when you’re done.</DialogDescription>
        </DialogHeader>
        <div class="grid gap-2">
          <label for="profile-name">Name</label>
          <input id="profile-name" name="name" value="Ada Lovelace" class="h-8 rounded-lg border border-border px-2" />
        </div>
        <DialogFooter showCloseButton={scenario === 'footer'}>
          <DialogClose class={buttonClass} data-testid="save">Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  {/if}
  <button type="button" class={buttonClass}>After</button>
  <div aria-live="polite" data-testid="announcement">Profile editor ready</div>
  <div class="mt-6 flex flex-wrap gap-2">
    <button type="button" onclick={() => open = true} data-testid="reopen">Reopen</button>
    <button type="button" onclick={() => open = false} data-testid="owner-close">Owner close</button>
    <button type="button" onclick={() => cancelNext = true} data-testid="cancel-next">Cancel next</button>
    <button type="button" onclick={() => show = false} data-testid="remove">Remove</button>
  </div>
  <output data-testid="state">{JSON.stringify({ open, completions })}</output>
</main>
