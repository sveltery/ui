<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { value: string; class?: string; children?: Snippet } = $props();
</script>

{@render children?.()}
