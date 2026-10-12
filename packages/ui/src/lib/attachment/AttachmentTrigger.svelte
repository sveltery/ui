<script lang="ts">
  import type { AttachmentTriggerProps, AttachmentTriggerState } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, render, type, ...props }: AttachmentTriggerProps = $props();
  const state: AttachmentTriggerState = { slot: 'attachment-trigger' };
  const hostProps = $derived({
    'data-slot': state.slot,
    type: render ? type : (type ?? 'button'),
    ...props,
    class: cn('cn-attachment-trigger absolute inset-0 z-10 outline-none', classProp),
  });
</script>
{#if render}
  {@render render(hostProps, state, children)}
{:else}
  <button {...hostProps}>{@render children?.()}</button>
{/if}
