<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<div class="steps mb-12 [counter-reset:step] md:ml-4 md:border-l md:pl-8 [&>h3]:step">
  {@render children()}
</div>
