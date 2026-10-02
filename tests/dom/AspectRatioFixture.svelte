<script lang="ts">
  import { untrack } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { AspectRatio } from '../../apps/docs/registry/bases/base/ui/aspect-ratio/index.js';
  let { initializeNull = false }: { initializeNull?: boolean } = $props();
  let ref = $state<HTMLDivElement | null | undefined>(untrack(() => initializeNull ? null : undefined));
  const initialRef = untrack(() => ref);
  let visible = $state(true);
  let changed = $state(false);
  let attachmentVersion = $state(0);
  let attached = 0;
  let detached = 0;
  const attachmentEvents: string[] = [];
  const calls: string[] = [];
  const assignments: (HTMLDivElement | null | undefined)[] = [];
  const key = createAttachmentKey();
  const attachment = $derived.by(() => {
    const version = attachmentVersion;
    return { [key]: (node: HTMLDivElement) => {
      attached++; attachmentEvents.push(`attach:${version}:${node.id}`);
      return () => { detached++; attachmentEvents.push(`detach:${version}:${node.id}`); };
    } };
  });
  const common = $derived({
    ratio: changed ? 1 : 16 / 9,
    class: changed ? 'static aspect-square' : 'rounded-lg',
    title: changed ? 'Updated ratio' : 'Initial ratio',
    'data-slot': changed ? 'consumer-updated' : 'consumer-initial',
    onclick: (event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) => calls.push(`click:${changed ? 'updated' : 'initial'}:${event.currentTarget.tagName}`),
  });
  export function snapshot() { return { ref, initialRef, attached, detached, attachmentEvents, calls, assignments }; }
  export function update() { changed = true; }
  export function replaceAttachment() { attachmentVersion++; }
  export function hide() { visible = false; }
  export function show() { visible = true; }
</script>
{#if visible}
  <AspectRatio id="native-ratio" {...common} {...attachment} bind:ref={() => ref, next => { ref = next; assignments.push(next); }}>{changed ? 'Updated message' : 'Initial message'}<span>Child</span></AspectRatio>
{/if}
