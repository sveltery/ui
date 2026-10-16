<script lang="ts">
  import { cn } from 'cn';
  import type { Snippet } from 'svelte';

  let { id, class: className, children }: { id?: string; class?: string; children: Snippet } = $props();
</script>

<div {id} class={cn('container-wrapper scroll-mt-24', className)}>
  <div class="container flex items-center justify-between gap-4 py-4">{@render children()}</div>
</div>
