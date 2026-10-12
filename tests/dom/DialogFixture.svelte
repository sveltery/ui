<script lang="ts">
  import * as UI from '$ui/dialog/index.js';
  let { contentClose = true, footerClose = false, cancel = false, events = [] }: { contentClose?: boolean; footerClose?: boolean; cancel?: boolean; events?: string[] } = $props();
  let open = $state(false);
  let visible = $state(true);
  export function isOpen() { return open; }
  export function setOpen(next: boolean) { open = next; }
  export function remove() { visible = false; }
  function attach(node: HTMLElement) {
    events.push(`attach:${node.dataset.slot}`);
    return () => { events.push(`detach:${node.dataset.slot}`); };
  }
</script>
{#if visible}
  <UI.Dialog bind:open onOpenChange={(next, details) => { events.push(`change:${next}:${details.reason}`); if (cancel) details.cancel(); }}>
    <UI.DialogTrigger>Open</UI.DialogTrigger>
    <UI.DialogContent class="p-8" showCloseButton={contentClose} {@attach attach}>
      <UI.DialogHeader>
        <UI.DialogTitle>Title</UI.DialogTitle>
        <UI.DialogDescription>Description</UI.DialogDescription>
      </UI.DialogHeader>
      <UI.DialogFooter showCloseButton={footerClose}>
        <UI.DialogClose>Dismiss</UI.DialogClose>
      </UI.DialogFooter>
    </UI.DialogContent>
  </UI.Dialog>
{/if}
