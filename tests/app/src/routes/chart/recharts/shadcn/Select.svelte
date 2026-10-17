<script lang="ts">
  import type { Snippet } from 'svelte';

  // The gallery's selects sit outside the chart, so this stub renders a closed select and never opens.
  let { children }: { value?: string; onValueChange?: (value: string) => void; children?: Snippet } = $props();
</script>

{@render children?.()}
