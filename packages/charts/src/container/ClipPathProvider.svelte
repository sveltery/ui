<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { uniqueId } from '../util/DataUtils.js';
  import { usePlotArea } from '../hooks.svelte.js';
  import { setClipPathIdContext } from './ClipPathProvider.hooks.js';

  let { children }: { children?: Snippet } = $props();
  const clipPathId = `${uniqueId('recharts')}-clip`;
  setClipPathIdContext(clipPathId);
  const plotArea = usePlotArea();
</script>

{#if plotArea.current != null}
  <defs>
    <clipPath id={clipPathId}>
      <rect x={plotArea.current.x} y={plotArea.current.y} height={plotArea.current.height} width={plotArea.current.width} />
    </clipPath>
  </defs>
  {@render children?.()}
{/if}
