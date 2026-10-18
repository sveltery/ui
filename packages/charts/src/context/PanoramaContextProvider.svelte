<script lang="ts">
  import type { Snippet } from 'svelte';
  import { providePanoramaContext } from './PanoramaContext.js';

  let { children }: { children: Snippet } = $props();
  providePanoramaContext();
</script>

{@render children()}
