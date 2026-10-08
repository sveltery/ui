<script lang="ts">
  import { onMount, untrack, type Snippet } from 'svelte';
  import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@sveltery/ui/dialog';
  import type { DialogDivProps, DialogPopupState, DialogTriggerHostProps, DialogTriggerState } from '@sveltery/base/dialog';
  let { scenario = 'ordinary' }: { scenario?: string } = $props();
  const generatedId = $props.id();
  const initialTriggerId = `example-trigger-${generatedId}`;
  let open = $state(untrack(() => scenario === 'initial'));
  let modal = $state<boolean | 'trap-focus'>(true);
  let dialog = $state<ReturnType<typeof Dialog>>();
  let trigger = $state<HTMLElement | null>(null);
  let popup = $state<HTMLElement | null>(null);
  let title = $state<HTMLElement | null>(null);
  let hydrated = $state(false);
  let cancelNext = $state(false);
  let show = $state(true);
  let log = $state<{ open: boolean; reason: string }[]>([]);
  let completions = $state<boolean[]>([]);
  let attachments = $state(0);
  let cleanups = $state(0);
  function attachment(_node: HTMLElement) {
    untrack(() => attachments++);
    return () => { untrack(() => cleanups++); };
  }
  // Base parts have no refs; an attachment records each actual host and clears it on removal.
  function capture(assign: (node: HTMLElement | null) => void) { return (node: HTMLElement) => { assign(node); return () => assign(null); }; }
  const buttonClass = 'cn-button cn-button-variant-outline cn-button-size-default inline-flex items-center justify-center';
  // Base ea4e108e calls onOpenChangeComplete inside an effect, so a callback that reads the state it writes loops. Reported to Base (sveltery/base#160); drop untrack once it lands.
  function completed(next: boolean) { untrack(() => completions.push(next)); }
  onMount(() => { hydrated = true; });
</script>
{#snippet triggerRender(props: DialogTriggerHostProps, _state: DialogTriggerState, children: Snippet)}<button {...props as HTMLButtonAttributes} data-replacement="trigger">{@render children()}</button>{/snippet}
{#snippet contentRender(props: DialogDivProps, _state: DialogPopupState, children: Snippet)}<section {...props as HTMLAttributes<HTMLElement>} data-replacement="content">{@render children()}</section>{/snippet}
<main class="mx-auto max-w-2xl p-8" data-hydrated={hydrated}>
  <h1 class="mb-4 text-2xl font-medium">Dialog</h1>
  <p class="mb-6 text-muted-foreground">Update your profile, then return to the page.</p>
  <button type="button" class={buttonClass} data-testid="before">Before</button>
  {#if show}
    {const resolvedTriggerId = $derived(scenario === 'initial' ? initialTriggerId : undefined)}
    <Dialog {open} {modal} defaultTriggerId={resolvedTriggerId} bind:this={dialog} onOpenChange={(next, details) => { log.push({ open: next, reason: details.reason }); if (cancelNext) { details.preventUnmountOnClose(); details.cancel(); cancelNext = false; } else open = next; }} onOpenChangeComplete={completed}>
      <DialogTrigger id={resolvedTriggerId} render={scenario === 'custom' ? triggerRender : undefined} class={buttonClass} {@attach capture(node => { trigger = node; })} data-testid="trigger" name="dialog-trigger" onclick={() => {}}>
        Edit profile
      </DialogTrigger>
      <DialogContent render={scenario === 'custom' ? contentRender : undefined} showCloseButton={scenario !== 'footer' && scenario !== 'no-close'} {@attach capture(node => { popup = node; })} {@attach scenario === 'custom' && attachment} data-testid="content">
        <DialogHeader>
          <DialogTitle {@attach capture(node => { title = node; })}>Edit profile</DialogTitle>
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
  <button type="button" class={buttonClass} data-testid="after">After</button>
  <div aria-live="polite" data-testid="announcement">Profile editor ready</div>
  <div class="mt-6 flex flex-wrap gap-2" data-testid="owner-controls">
    <button type="button" onclick={() => open = true} data-testid="reopen">Reopen</button>
    <button type="button" onclick={() => open = false} data-testid="owner-close">Owner close</button>
    <button type="button" onclick={() => cancelNext = true} data-testid="cancel-next">Cancel next</button>
    <button type="button" onclick={() => show = false} data-testid="remove">Remove</button>
    <button type="button" onclick={() => dialog?.close()} data-testid="action-close">Action close</button>
    <button type="button" onclick={() => modal = false} data-testid="nonmodal">Nonmodal</button>
  </div>
  <output data-testid="state">{JSON.stringify({ open, log, completions, trigger: trigger?.dataset.replacement ?? !!trigger, popup: popup?.dataset.replacement ?? !!popup, title: title?.textContent ?? null, attachments, cleanups })}</output>
</main>
