<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { clsx } from 'clsx';
  import Layer from '../container/Layer.svelte';
  import GraphicalItemClipPath from './GraphicalItemClipPath.svelte';
  import BarBackground from './BarBackground.svelte';
  import RectanglesWithAnimation from './RectanglesWithAnimation.svelte';
  import type { InternalProps } from './Bar.js';

  let props: InternalProps & { children?: Snippet } = $props();
</script>

{#if !(props.hide || props.data == null)}
  <Layer class={clsx('recharts-bar', props.className)} id={props.id}>
    {#if props.needClip}
      <defs><GraphicalItemClipPath clipPathId={props.id} xAxisId={props.xAxisId} yAxisId={props.yAxisId} /></defs>
    {/if}
    <Layer class="recharts-bar-rectangles" clipPath={props.needClip ? `url(#clipPath-${props.id})` : undefined}>
      <BarBackground data={props.data} dataKey={props.dataKey} background={props.background} allOtherBarProps={props} />
      <RectanglesWithAnimation {props} />
    </Layer>
  </Layer>
{/if}
