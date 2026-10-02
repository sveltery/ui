<script lang="ts">
  import { createAttachmentKey } from 'svelte/attachments';
  import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from '../../apps/docs/registry/bases/base/ui/empty/index.js';
  const parts = [Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia];
  let refs = $state<(HTMLDivElement | null | undefined)[]>(parts.map((_, index) => index % 2 ? null : undefined));
  let shown = $state(true);
  let changed = $state(false);
  let replaced = $state(false);
  let attached = 0;
  let detached = 0;
  const clicks: string[] = [];
  function attachment(node: HTMLDivElement) { attached++; node.dataset.attached = 'true'; return () => { detached++; }; }
  const initial = (node: HTMLDivElement) => attachment(node);
  const replacement = (node: HTMLDivElement) => attachment(node);
  const spread = $derived({ [createAttachmentKey()]: replaced ? replacement : initial });
  export function snapshot() { return { refs: [...refs], attached, detached, clicks: [...clicks] }; }
  export function update() { changed = true; }
  export function swap() { replaced = !replaced; }
  export function remove() { shown = false; }
  export function show() { shown = true; }
</script>
{const label = $derived(changed ? 'Updated & <Empty>' : 'Initial & <Empty>')}
{#if shown}
  {#each parts as Part, index (Part)}
    <Part id={`bound-empty-${index}`} bind:ref={refs[index]} {...spread} class={changed ? 'grid px-6' : 'grid px-3'} title={`${label} ${index}`} onclick={event => clicks.push(event.currentTarget.id)}>{label} {index}</Part>
  {/each}
{/if}
