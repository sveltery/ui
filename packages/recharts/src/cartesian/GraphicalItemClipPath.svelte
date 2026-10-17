<svelte:options namespace="svg" />

<script lang="ts">
  import type { AxisId } from '../state/cartesianAxisSlice.js';
  import { usePlotArea } from '../hooks.svelte.js';
  import { useNeedsClip } from './GraphicalItemClipPath.hooks.js';

  let { xAxisId, yAxisId, clipPathId }: { xAxisId: AxisId; yAxisId: AxisId; clipPathId: string } = $props();

  const plotArea = usePlotArea();
  const clip = useNeedsClip(
    () => xAxisId,
    () => yAxisId,
  );
</script>

{#if clip.current.needClip && plotArea.current}
  {const { needClipX, needClipY } = clip.current}
  {const { x, y, width, height } = plotArea.current}
  <clipPath id="clipPath-{clipPathId}"
    ><rect x={needClipX ? x : x - width / 2} y={needClipY ? y : y - height / 2} width={needClipX ? width : width * 2} height={needClipY ? height : height * 2} /></clipPath
  >
{/if}
