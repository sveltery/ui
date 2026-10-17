<script lang="ts">
  import Cell from '../../../src/component/Cell.svelte';
  import type { CellEntry } from '../../../src/component/Cell.hooks.svelte.js';
  import type { Box } from '../../../src/state/hooks.svelte.js';
  import CellReader from './CellReader.svelte';

  let { onready }: { onready: (cells: Box<ReadonlyArray<CellEntry>>) => void } = $props();

  let fills = $state(['red', 'green', 'blue']);

  export function setFill(index: number, fill: string) {
    fills[index] = fill;
  }

  export function setFills(next: string[]) {
    fills = next;
  }
</script>

<CellReader {onready}>{#each fills as fill, index (index)}<Cell {fill} class="cell-{index}" />{/each}</CellReader>
