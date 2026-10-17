<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { class?: string; align?: 'start' | 'center' | 'end'; children?: Snippet } = $props();
  // Radix portals the content only while the select is open, and this stub never opens.
  const open = false;
</script>

{#if open}{@render children?.()}{/if}
