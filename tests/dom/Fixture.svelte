<script lang="ts">
  import { createAttachmentKey } from 'svelte/attachments';
  import { untrack, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import * as UI from '../../apps/docs/registry/bases/base/ui/dialog/index.js';
  import type { DialogChangeEventDetails } from '@sveltery/base/dialog';
  let { custom = false, keep = false, initial = false, prevent = false, disabled = false, disabledAnchor = false, log = () => {} }: { custom?: boolean; keep?: boolean; initial?: boolean; prevent?: boolean; disabled?: boolean; disabledAnchor?: boolean; log?: (kind: string, details?: DialogChangeEventDetails) => void } = $props();
  let open = $state(untrack(() => initial));
  let visible = $state(true);
  let cancellation = $state('');
  let dialog = $state<ReturnType<typeof UI.Dialog>>();
  let trigger = $state<HTMLElement | null>(null);
  let portalHost = $state<HTMLElement | null>(null);
  let overlay = $state<HTMLElement | null>(null);
  let popup = $state<HTMLElement | null>(null);
  let title = $state<HTMLElement | null>(null);
  let description = $state<HTMLElement | null>(null);
  let close = $state<HTMLElement | null>(null);
  let header = $state<HTMLDivElement | null>(null);
  let footer = $state<HTMLDivElement | null>(null);
  let attachments = 0;
  let cleanups = 0;
  const key = createAttachmentKey();
  const attached = { [key]: (node: HTMLElement) => { attachments++; node.dataset.attached = ''; return () => { cleanups++; }; } };
  // Base parts have no refs; an attachment records each actual host and clears it on removal.
  function capture(assign: (node: HTMLElement | null) => void) { return (node: HTMLElement) => { assign(node); return () => assign(null); }; }
  export function refs() { return { trigger, portal: portalHost, overlay, popup, title, description, close, header, footer, attachments, cleanups }; }
  export function portal() { return popup?.closest<HTMLElement>('[data-base-ui-portal]') ?? null; }
  export function actions() { return dialog; }
  export function remove() { visible = false; }
  export function setCancel(value: string) { cancellation = value; }
  export function setOpen(value: boolean) { open = value; }
</script>
{#snippet buttonRender(props: HTMLAttributes<HTMLElement>, _state: unknown, children: Snippet)}<span {...props} onclick={event => { log('replacement-click'); props.onclick?.(event); }} data-replacement="">{@render children()}</span>{/snippet}
{#snippet divRender(props: Record<string | symbol, unknown>, _state: unknown, children: Snippet)}<div {...props} data-replacement="">{@render children()}</div>{/snippet}
{#snippet titleRender(props: Record<string | symbol, unknown>, _state: unknown, children: Snippet)}<h3 {...props} data-replacement="">{@render children()}</h3>{/snippet}
{#snippet anchorRender(props: Record<string | symbol, unknown>, _state: unknown, children: Snippet)}<a {...props} href="#navigation" data-replacement="">{@render children()}</a>{/snippet}
{#if visible}
  <UI.Dialog {open} bind:this={dialog} onOpenChange={(next, details) => { log('change', details); if (cancellation === 'close' || cancellation === 'defer-close') { if (cancellation === 'defer-close') details.preventUnmountOnClose(); details.cancel(); } else open = next; }}>
    <UI.DialogTrigger {...attached} {@attach capture(node => { trigger = node; })} id="trigger" name="open" type="button" nativeButton={!custom} {disabled} render={custom ? buttonRender : undefined} onclick={event => { log('consumer-click'); if (prevent) event.preventDefault(); }}>Open</UI.DialogTrigger>
    <!-- Base cbe46682 Portal takes host attributes and attachments but declares no render prop (open Base gap); the replacement still reaches it by spread. -->
    <UI.DialogPortal {...attached} keepMounted={keep} {@attach capture(node => { portalHost = node; })} {...(custom ? { render: divRender } : {})}>
      <UI.DialogOverlay {...attached} {@attach capture(node => { overlay = node; })} render={custom ? divRender : undefined} class="opacity-100" />
      <UI.DialogContent {...attached} {@attach capture(node => { popup = node; })} render={custom ? divRender : undefined} class="p-8" showCloseButton={false} style="--is-open:1">
        <UI.DialogHeader {...attached} bind:ref={header}>
          <UI.DialogTitle {...attached} {@attach capture(node => { title = node; })} render={custom ? titleRender : undefined}>Title</UI.DialogTitle>
          <UI.DialogDescription {...attached} {@attach capture(node => { description = node; })} render={custom ? divRender : undefined}>Description</UI.DialogDescription>
        </UI.DialogHeader>
        <UI.DialogFooter {...attached} bind:ref={footer}>
          <UI.DialogClose {...attached} {@attach capture(node => { close = node; })} id="close" disabled={disabledAnchor} nativeButton={!custom && !disabledAnchor} render={disabledAnchor ? anchorRender : custom ? buttonRender : undefined}>Dismiss</UI.DialogClose>
        </UI.DialogFooter>
      </UI.DialogContent>
    </UI.DialogPortal>
  </UI.Dialog>
{/if}
