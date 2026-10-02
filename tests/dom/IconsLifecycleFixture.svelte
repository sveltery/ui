<script lang="ts">
  import { createAttachmentKey } from 'svelte/attachments';
  import { untrack } from 'svelte';
  import IconPlaceholder from '../../apps/docs/registry/bases/base/ui/icons/IconPlaceholder.svelte';
  let ref = $state<SVGSVGElement | null>();
  let show = $state(true);
  let className = $state<string | undefined>();
  let clicks = $state(0);
  let attached = 0;
  let detached = 0;
  const key = createAttachmentKey();
  const first = (node: SVGSVGElement) => { attached++; node.dataset.attached = 'first'; return () => { detached++; }; };
  const second = (node: SVGSVGElement) => { attached++; node.dataset.attached = 'second'; return () => { detached++; }; };
  let attachment = $state(first);
  export function snapshot() { return untrack(() => ({ ref, attached, detached, clicks })); }
  export function setClass(next: string | undefined) { className = next; }
  export function swap() { attachment = second; }
  export function remove() { show = false; }
</script>
{#if show}
  <IconPlaceholder bind:ref class={className} lucide="ArrowLeftIcon" tabler="IconArrowLeft" hugeicons="ArrowLeft01Icon" phosphor="ArrowLeftIcon" remixicon="RiArrowLeftLine" onclick={() => clicks++} {...{ [key]: attachment }}>
    <text data-icon-child>Native &amp; escaped</text>
  </IconPlaceholder>
{/if}
