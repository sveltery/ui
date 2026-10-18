<script lang="ts">
  import type { Snippet } from 'svelte';
  import { provideCellReader, type CellEntry } from '../../../src/component/Cell.hooks.svelte.js';
  import type { Box } from '../../../src/state/hooks.svelte.js';

  let { onready, children }: { onready: (cells: Box<ReadonlyArray<CellEntry>>) => void; children: Snippet } = $props();

  const cells = provideCellReader();
  $effect.pre(() => onready(cells));
</script>

{@render children()}
