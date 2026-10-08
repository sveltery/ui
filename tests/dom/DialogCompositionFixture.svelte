<script lang="ts">
  import { createAttachmentKey } from 'svelte/attachments';
  import { untrack, type Snippet } from 'svelte';
  import { Dialog, DialogContent, DialogFooter, DialogTitle } from '../../apps/docs/registry/bases/base/ui/dialog/index.js';
  import { IconLibraryProvider, type IconLibraryName } from '../../apps/docs/registry/bases/base/ui/icons/index.js';
  let { contentClose = true, footerClose = true, custom = false }: { contentClose?: boolean; footerClose?: boolean; custom?: boolean } = $props();
  let library = $state<IconLibraryName>('lucide');
  let open = $state(true);
  let cancel = $state(false);
  let visible = $state(true);
  let popup = $state<HTMLElement | null>(null);
  let footer = $state<HTMLDivElement | null>(null);
  let attachments = 0;
  let cleanups = 0;
  const changes: string[] = [];
  const key = createAttachmentKey();
  const attached = { [key]: (node: HTMLElement) => { attachments++; node.dataset.attached = ''; return () => { cleanups++; }; } };
  export function setLibrary(next: IconLibraryName) { library = next; }
  export function setCancel(next: boolean) { cancel = next; }
  export function remove() { visible = false; }
  function capture<T extends HTMLElement>(assign: (node: T | null) => void) { return (node: T) => { assign(node); return () => assign(null); }; }
  export function observed() { return { open, popup, footer, attachments, cleanups, changes }; }
</script>
{#snippet popupRender(props: Record<string | symbol, unknown>, _state: unknown, children: Snippet | undefined)}
  <section {...props} data-replacement="">{@render children?.()}</section>
{/snippet}
{#if visible}
  <IconLibraryProvider {library}>
    <Dialog {open} modal={false} onOpenChange={(next, details) => { changes.push(details.reason); if (untrack(() => cancel)) details.cancel(); else open = next; }}>
      <DialogContent {...attached} {@attach capture(node => { popup = node; })} showCloseButton={contentClose} render={custom ? popupRender : undefined}>
        <DialogTitle>Composition</DialogTitle>
        <p data-testid="owner-child">Owner content</p>
        <DialogFooter {...attached} bind:ref={footer} showCloseButton={footerClose} />
      </DialogContent>
    </Dialog>
  </IconLibraryProvider>
{/if}
