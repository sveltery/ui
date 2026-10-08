<script lang="ts">
  import { onMount, untrack, type ComponentProps } from 'svelte';
  import { Button } from '@sveltery/ui/button';
  import { Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@sveltery/ui/dialog';
  type Container = ComponentProps<typeof DialogPortal>['container'];
  type Part = 'button' | 'trigger' | 'overlay' | 'content' | 'title' | 'description' | 'close';
  let open = $state(false);
  let show = $state(true);
  let hydrated = $state(false);
  // Base cbe46682 parts have no refs. Each attachment records its actual host and clears it on removal.
  let hosts = $state<Partial<Record<Part, HTMLElement | null>>>({});
  let dialog = $state<ReturnType<typeof Dialog>>();
  let first = $state<HTMLDivElement | null>(null);
  let container = $state.raw<Container>(undefined);
  let attachments = $state<Partial<Record<Part, number>>>({});
  let cleanups = $state<Partial<Record<Part, number>>>({});
  let bindingLog = $state<(string | null)[]>([]);
  function attachment(part: Part) {
    return (node: HTMLElement) => {
      untrack(() => { attachments[part] = (attachments[part] ?? 0) + 1; hosts[part] = node; if (part === 'button') bindingLog.push(node.tagName); });
      node.dataset.probed = part;
      return () => { untrack(() => { cleanups[part] = (cleanups[part] ?? 0) + 1; if (hosts[part] === node) hosts[part] = null; if (part === 'button') bindingLog.push(null); }); };
    };
  }
  // The Portal host takes no attachment at this Base pin; read the outer one from the Popup it contains.
  // DialogContent adds its own nested Portal, which mounts inside the outer portal host.
  function portal() {
    let node = hosts.content?.closest<HTMLElement>('[data-base-ui-portal]') ?? null;
    while (node?.parentElement?.closest('[data-base-ui-portal]')) node = node.parentElement.closest<HTMLElement>('[data-base-ui-portal]');
    return node;
  }
  export function refs() { return { ...hosts, portal: portal() }; }
  export function actions() { return dialog; }
  export function remove() { show = false; }
  export function setContainer(mode: 'undefined' | 'null' | 'element') {
    container = mode === 'undefined' ? undefined : mode === 'null' ? null : first;
  }
  const parts: Part[] = ['button', 'trigger', 'overlay', 'content', 'title', 'description', 'close'];
  const tags = $derived(Object.fromEntries(parts.map(part => [part, hosts[part] === undefined ? 'undefined' : hosts[part]?.tagName ?? null])));
  onMount(() => { hydrated = true; });
</script>
{#snippet ownerControls()}
  <button data-testid="base-pin-null" type="button" onclick={() => setContainer('null')}>Explicit null</button>
  <button data-testid="base-pin-element" type="button" onclick={() => setContainer('element')}>Native target</button>
  <button data-testid="base-pin-undefined" type="button" onclick={() => setContainer('undefined')}>Default target</button>
  <button data-testid="base-pin-action-close" type="button" onclick={() => dialog?.close()}>Imperative close</button>
  <button data-testid="base-pin-remove" type="button" onclick={remove}>Remove ref probe</button>
{/snippet}
<main data-hydrated={hydrated}>
  <h1>Base pin public host and Portal regression</h1>
  <div id="base-pin-first" bind:this={first}></div>
  {#if show}
    <Button data-testid="base-pin-button" {@attach attachment('button')}>UI button</Button>
    <Dialog {open} modal={false} disablePointerDismissal bind:this={dialog} onOpenChange={next => open = next}>
      <DialogTrigger data-testid="base-pin-trigger" {@attach attachment('trigger')}>Open ref probe</DialogTrigger>
      <DialogPortal {container}>
        <DialogOverlay class="pointer-events-none" {@attach attachment('overlay')} />
        <DialogContent showCloseButton={false} {@attach attachment('content')}>
          <DialogTitle {@attach attachment('title')}>Public hosts</DialogTitle>
          <DialogDescription {@attach attachment('description')}>All hosts and attachments use the public UI API.</DialogDescription>
          {@render ownerControls()}
          <DialogClose data-testid="base-pin-close" {@attach attachment('close')}>Close ref probe</DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  {/if}
  {@render ownerControls()}
  <pre data-testid="base-pin-state">{JSON.stringify({ open, tags, attachments, cleanups, bindingLog, actions: !!dialog })}</pre>
</main>
