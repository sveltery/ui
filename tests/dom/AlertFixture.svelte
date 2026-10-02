<script lang="ts">
  import { untrack } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { Alert, AlertTitle, AlertDescription, AlertAction } from '../../apps/docs/registry/bases/base/ui/alert/index.js';
  let { part = 'Alert', initializeNull = false }: { part?: 'Alert' | 'AlertTitle' | 'AlertDescription' | 'AlertAction'; initializeNull?: boolean } = $props();
  const Component = $derived({ Alert, AlertTitle, AlertDescription, AlertAction }[part]);
  let ref = $state<HTMLDivElement | null | undefined>(untrack(() => initializeNull ? null : undefined));
  const initialRef = untrack(() => ref);
  let visible = $state(true);
  let changed = $state(false);
  let attachmentVersion = $state(0);
  let attached = 0;
  let detached = 0;
  const nodes: HTMLDivElement[] = [];
  const attachmentEvents: string[] = [];
  const calls: string[] = [];
  const assignments: (HTMLDivElement | null | undefined)[] = [];
  const attachmentKey = createAttachmentKey();
  const attachment = $derived.by(() => {
    const version = attachmentVersion;
    return { [attachmentKey]: (node: HTMLDivElement) => {
      attached++; nodes.push(node); attachmentEvents.push(`attach:${version}:${node.id}`);
      return () => { detached++; attachmentEvents.push(`detach:${version}:${node.id}`); };
    } };
  });
  const common = $derived({
    class: changed ? ['relative', { 'text-lg': true, 'w-auto': true }] : 'text-xs',
    title: changed ? 'Updated & <alert>' : 'Initial & <alert>',
    'data-slot': changed ? 'consumer-updated' : 'consumer-initial',
    onclick: (event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) => calls.push(`click:${changed ? 'updated' : 'initial'}:${event.currentTarget.tagName}`),
  });
  export function snapshot() { return { ref, initialRef, attached, detached, nodes, attachmentEvents, calls, assignments }; }
  export function update() { changed = true; }
  export function replaceAttachment() { attachmentVersion++; }
  export function hide() { visible = false; }
  export function show() { visible = true; }
</script>
{#if visible}
  <Component id="native-alert" {...common} {...attachment} bind:ref={() => ref, next => { ref = next; assignments.push(next); }}>{changed ? 'Updated message' : 'Initial message'}<a href="#native-link">Details</a></Component>
{/if}
