<script lang="ts">
  import { createAttachmentKey } from 'svelte/attachments';
  import { untrack, type Snippet } from 'svelte';
  import * as UI from '../../apps/docs/registry/bases/base/ui/dialog/index.js';
  import { mergeProps } from '@sveltery/base/merge-props';
  import type { Actions, ChangeEventDetails } from '@sveltery/base/dialog';
  let { custom = false, keep = false, initial = false, prevent = false, disabled = false, disabledAnchor = false, log = () => {} }: { custom?: boolean; keep?: boolean; initial?: boolean; prevent?: boolean; disabled?: boolean; disabledAnchor?: boolean; log?: (kind: string, details?: ChangeEventDetails) => void } = $props();
  let open = $state(untrack(() => initial));
  let visible = $state(true);
  let cancellation = $state('');
  let actions = $state<Actions | null>(null);
  let trigger = $state<HTMLElement | null>(null);
  let portal = $state<HTMLElement | null>(null);
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
  export function refs() { return { trigger, portal, overlay, popup, title, description, close, header, footer, attachments, cleanups, actions }; }
  export function remove() { visible = false; }
  export function setCancel(value: string) { cancellation = value; }
  export function setOpen(value: boolean) { open = value; }
</script>
{#snippet buttonRender(props: Record<string | symbol, unknown>, _state: unknown, children: Snippet | undefined)}<span {...mergeProps(props, { onclick: () => log('replacement-click') })} data-replacement="">{@render children?.()}</span>{/snippet}
{#snippet divRender(props: Record<string | symbol, unknown>, _state: unknown, children: Snippet | undefined)}<div {...props} data-replacement="">{@render children?.()}</div>{/snippet}
{#snippet titleRender(props: Record<string | symbol, unknown>, _state: unknown, children: Snippet | undefined)}<h3 {...props} data-replacement="">{@render children?.()}</h3>{/snippet}
{#snippet anchorRender(props: Record<string | symbol, unknown>, _state: unknown, children: Snippet | undefined)}<a {...props} href="#navigation" data-replacement="">{@render children?.()}</a>{/snippet}
{#if visible}
  <UI.Dialog {open} bind:actions onOpenChange={(next, details) => { log('change', details); if (cancellation === 'close' || cancellation === 'defer-close') { if (cancellation === 'defer-close') details.preventUnmountOnClose(); details.cancel(); } else open = next; }}>
    <UI.DialogTrigger {...attached} bind:ref={trigger} id="trigger" name="open" type="button" nativeButton={!custom} {disabled} render={custom ? buttonRender : undefined} onclick={event => { log('consumer-click'); if (prevent) event.preventBaseUIHandler(); }}>Open</UI.DialogTrigger>
    <UI.DialogPortal {...attached} keepMounted={keep} bind:ref={portal} render={custom ? divRender : undefined}>
      <UI.DialogOverlay {...attached} bind:ref={overlay} render={custom ? divRender : undefined} class={state => state.open ? 'opacity-100' : 'opacity-0'} />
      <UI.DialogContent {...attached} bind:ref={popup} render={custom ? divRender : undefined} class="p-8" showCloseButton={false} style={state => `--is-open:${Number(state.open)}`}>
        <UI.DialogHeader {...attached} bind:ref={header}>
          <UI.DialogTitle {...attached} bind:ref={title} render={custom ? titleRender : undefined}>Title</UI.DialogTitle>
          <UI.DialogDescription {...attached} bind:ref={description} render={custom ? divRender : undefined}>Description</UI.DialogDescription>
        </UI.DialogHeader>
        <UI.DialogFooter {...attached} bind:ref={footer}>
          <UI.DialogClose {...attached} bind:ref={close} id="close" disabled={disabledAnchor} nativeButton={!custom && !disabledAnchor} render={disabledAnchor ? anchorRender : custom ? buttonRender : undefined}>Dismiss</UI.DialogClose>
        </UI.DialogFooter>
      </UI.DialogContent>
    </UI.DialogPortal>
  </UI.Dialog>
{/if}
