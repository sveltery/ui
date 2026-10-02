<script lang="ts">
  import { untrack } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { Label } from '../../apps/docs/registry/bases/base/ui/label/index.js';
  let { initializeNull = false }: { initializeNull?: boolean } = $props();
  let ref = $state<HTMLLabelElement | null | undefined>(untrack(() => initializeNull ? null : undefined));
  const initialRef = untrack(() => ref);
  let visible = $state(true);
  let changed = $state(false);
  let attachmentVersion = $state(0);
  let attached = 0;
  let detached = 0;
  const nodes: HTMLLabelElement[] = [];
  const attachmentEvents: string[] = [];
  const calls: string[] = [];
  const assignments: (HTMLLabelElement | null | undefined)[] = [];
  const attachmentKey = createAttachmentKey();
  const attachment = $derived.by(() => {
    const version = attachmentVersion;
    return { [attachmentKey]: (node: HTMLLabelElement) => {
      attached++; nodes.push(node); attachmentEvents.push(`attach:${version}:${node.id}`);
      return () => { detached++; attachmentEvents.push(`detach:${version}:${node.id}`); };
    } };
  });
  const common = $derived({
    class: changed ? 'inline-block items-start select-text' : 'items-end',
    for: changed ? 'label-second-control' : 'label-first-control',
    title: changed ? 'Updated label' : 'Initial label',
    'data-slot': changed ? 'consumer-updated' : 'consumer-initial',
    onclick: (event: MouseEvent & { currentTarget: EventTarget & HTMLLabelElement }) => calls.push(`click:${changed ? 'updated' : 'initial'}:${event.currentTarget.tagName}`),
  });
  export function snapshot() { return { ref, initialRef, attached, detached, nodes, attachmentEvents, calls, assignments }; }
  export function update() { changed = true; }
  export function replaceAttachment() { attachmentVersion++; }
  export function hide() { visible = false; }
  export function show() { visible = true; }
</script>
{#if visible}
  <Label id="native-label" {...common} {...attachment} bind:ref={() => ref, next => { ref = next; assignments.push(next); }}>{changed ? 'Updated message' : 'Initial message'}</Label>
{/if}
<textarea id="label-first-control" aria-label="First supplemental native control"></textarea>
<textarea id="label-second-control" aria-label="Second supplemental native control"></textarea>
