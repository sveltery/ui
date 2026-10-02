<script lang="ts">
  import { createAttachmentKey } from 'svelte/attachments';
  import { Skeleton } from '../../apps/docs/registry/bases/base/ui/skeleton/index.js';
  let ref = $state<HTMLDivElement | null | undefined>();
  let visible = $state(true);
  let label = $state('Initial');
  let className = $state('h-4 w-40');
  let attached = 0;
  let detached = 0;
  const calls: string[] = [];
  const attachment = { [createAttachmentKey()]: (node: HTMLDivElement) => { attached++; calls.push(`attach:${node.id}`); return () => { detached++; calls.push(`detach:${node.id}`); }; } };
  export function snapshot() { return { ref, attached, detached, calls }; }
  export function update() { label = 'Updated'; className = 'h-8 w-32 rounded-none animate-none'; }
  export function remove() { visible = false; }
  export function show() { visible = true; }
</script>
{#if visible}
  {const description = $derived(`${label} placeholder`)}
  <Skeleton id="bound-skeleton" title={description} class={className} bind:ref {...attachment} onclick={() => calls.push('click')}>{label}</Skeleton>
{/if}
