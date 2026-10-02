<script lang="ts">
  import { onMount, untrack, type ComponentProps } from 'svelte';
  import { Button } from '@sveltery/ui/button';
  import { Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@sveltery/ui/dialog';
  import type { Actions } from '@sveltery/base/dialog';
  type Container = ComponentProps<typeof DialogPortal>['container'];
  type Part = 'button' | 'trigger' | 'portal' | 'overlay' | 'content' | 'title' | 'description' | 'close';
  let open = $state(false);
  let show = $state(true);
  let hydrated = $state(false);
  let button = $state<HTMLElement | null>();
  let trigger = $state<HTMLElement | null>();
  let portal = $state<HTMLElement | null>();
  let overlay = $state<HTMLElement | null>();
  let content = $state<HTMLElement | null>();
  let title = $state<HTMLElement | null>();
  let description = $state<HTMLElement | null>();
  let close = $state<HTMLElement | null>();
  let actions = $state<Actions | null>(null);
  let first = $state<HTMLDivElement | null>(null);
  let second = $state<HTMLDivElement | null>(null);
  let container = $state.raw<Container>({ current: null });
  let attachments = $state<Partial<Record<Part, number>>>({});
  let cleanups = $state<Partial<Record<Part, number>>>({});
  let bindingLog = $state<(string | null)[]>([]);
  function attachment(part: Part) {
    return (node: HTMLElement) => {
      untrack(() => { attachments[part] = (attachments[part] ?? 0) + 1; });
      node.dataset.probed = part;
      return () => { untrack(() => { cleanups[part] = (cleanups[part] ?? 0) + 1; }); };
    };
  }
  export function refs() { return { button, trigger, portal, overlay, content, title, description, close, actions }; }
  export function remove() { show = false; }
  export function setContainer(mode: 'undefined' | 'null' | 'null-ref' | 'element-current' | 'ref-owner-document' | 'element') {
    const reference = { current: second, ownerDocument: undefined };
    container = mode === 'undefined' ? undefined : mode === 'null' ? null : mode === 'null-ref' ? { current: null } : mode === 'ref-owner-document' ? reference : mode === 'element-current' ? Object.assign(first!, { current: null }) : first;
  }
  const tags = $derived(Object.fromEntries(Object.entries({ button, trigger, portal, overlay, content, title, description, close }).map(([part, node]) => [part, node === undefined ? 'undefined' : node?.tagName ?? null])));
  onMount(() => { hydrated = true; });
</script>
<main data-hydrated={hydrated}>
  <h1>Base pin public ref and Portal regression</h1>
  <div id="base-pin-first" bind:this={first}></div>
  <div id="base-pin-second" bind:this={second}></div>
  {#if show}
    <Button data-testid="base-pin-button" bind:ref={button} {@attach attachment('button')}>UI button</Button>
    <Dialog {open} modal={false} disablePointerDismissal bind:actions onOpenChange={next => open = next}>
      <DialogTrigger data-testid="base-pin-trigger" bind:ref={() => trigger, value => { trigger = value; untrack(() => bindingLog.push(value?.tagName ?? null)); }} {@attach attachment('trigger')}>Open ref probe</DialogTrigger>
      <DialogPortal data-testid="base-pin-portal" {container} bind:ref={portal} {@attach attachment('portal')}>
        <DialogPortal container={{ current: null }} data-testid="base-pin-nested"><span>Nested empty ref</span></DialogPortal>
        <DialogOverlay class="pointer-events-none" bind:ref={overlay} {@attach attachment('overlay')} />
        <DialogContent showCloseButton={false} bind:ref={content} {@attach attachment('content')}>
          <DialogTitle bind:ref={title} {@attach attachment('title')}>Public refs</DialogTitle>
          <DialogDescription bind:ref={description} {@attach attachment('description')}>All hosts and attachments use the public UI API.</DialogDescription>
          <DialogClose data-testid="base-pin-close" bind:ref={close} {@attach attachment('close')}>Close ref probe</DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  {/if}
  <button data-testid="base-pin-null" type="button" onclick={() => setContainer('null')}>Explicit null</button>
  <button data-testid="base-pin-null-ref" type="button" onclick={() => setContainer('null-ref')}>Empty ref</button>
  <button data-testid="base-pin-element" type="button" onclick={() => setContainer('element')}>Native target</button>
  <button data-testid="base-pin-element-current" type="button" onclick={() => setContainer('element-current')}>Native target with current</button>
  <button data-testid="base-pin-ref-owner-document" type="button" onclick={() => setContainer('ref-owner-document')}>Ref with ownerDocument</button>
  <button data-testid="base-pin-undefined" type="button" onclick={() => setContainer('undefined')}>Default target</button>
  <button data-testid="base-pin-action-close" type="button" onclick={() => actions?.close()}>Imperative close</button>
  <button data-testid="base-pin-remove" type="button" onclick={remove}>Remove ref probe</button>
  <pre data-testid="base-pin-state">{JSON.stringify({ open, tags, attachments, cleanups, bindingLog, actions: !!actions, portalParent: portal?.parentElement ? portal.parentElement.id || portal.parentElement.tagName.toLowerCase() : null })}</pre>
</main>
