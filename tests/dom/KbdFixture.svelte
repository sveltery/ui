<script lang="ts">
  import { createAttachmentKey } from 'svelte/attachments';
  import { Kbd, KbdGroup } from '../../apps/docs/registry/bases/base/ui/kbd/index.js';
  let visible = $state(true);
  let label = $state('Ctrl');
  let className = $state('px-3');
  let ref = $state<HTMLElement>();
  let groupRef = $state<HTMLElement>();
  let attached = 0;
  let detached = 0;
  let clicks = 0;
  const attachment = { [createAttachmentKey()]: (node: HTMLElement) => { attached++; node.dataset.attached = 'true'; return () => { detached++; }; } };
  export function snapshot() { return { ref, groupRef, attached, detached, clicks }; }
  export function update() { label = 'Shift'; className = 'px-6'; }
  export function remove() { visible = false; }
</script>
{const caption = $derived(`${label} key`)}
{#if visible}
  <KbdGroup id="bound-group" bind:ref={groupRef} {...attachment}>
    <Kbd id="bound-kbd" bind:ref {...attachment} class={className} title={caption} onclick={() => clicks++}>{label}</Kbd>
  </KbdGroup>
{/if}
