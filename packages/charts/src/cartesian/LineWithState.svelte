<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { clsx } from 'clsx';
  import Layer from '../container/Layer.svelte';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import ActivePoints from '../component/ActivePoints.svelte';
  import SetErrorBarContext from '../context/SetErrorBarContext.svelte';
  import { getRadiusAndStrokeWidthFromDot } from '../util/getRadiusAndStrokeWidthFromDot.js';
  import { isClipDot } from '../util/ReactUtils.js';
  import GraphicalItemClipPath from './GraphicalItemClipPath.svelte';
  import CurveWithAnimation from './CurveWithAnimation.svelte';
  import { errorBarDataPointFormatter, type InternalProps } from './Line.js';

  let props: InternalProps & { children?: Snippet } = $props();

  const clipPathId = $derived(props.id);
  const radiusAndStrokeWidth = $derived(getRadiusAndStrokeWidthFromDot(props.dot));
  const clipDot = $derived(isClipDot(props.dot));
  const dotSize = $derived(radiusAndStrokeWidth.r * 2 + radiusAndStrokeWidth.strokeWidth);
  const activePointsClipPath = $derived(props.needClip ? `url(#clipPath-${clipDot ? '' : 'dots-'}${clipPathId})` : undefined);
</script>

{#if !props.hide}
  <ZIndexLayer zIndex={props.zIndex}>
    <Layer class={clsx('recharts-line', props.className)}>
      {#if props.needClip}
        <defs
          ><GraphicalItemClipPath {clipPathId} xAxisId={props.xAxisId} yAxisId={props.yAxisId} />{#if !clipDot}<clipPath id="clipPath-dots-{clipPathId}"
              ><rect x={props.left - dotSize / 2} y={props.top - dotSize / 2} width={props.width + dotSize} height={props.height + dotSize} /></clipPath
            >{/if}</defs
        >
      {/if}
      <SetErrorBarContext xAxisId={props.xAxisId} yAxisId={props.yAxisId} data={props.points} dataPointFormatter={errorBarDataPointFormatter} errorBarOffset={0}>
        <CurveWithAnimation {props} {clipPathId} />
      </SetErrorBarContext>
    </Layer>
    <ActivePoints activeDot={props.activeDot} points={props.points} mainColor={props.stroke} itemDataKey={props.dataKey} clipPath={activePointsClipPath} />
  </ZIndexLayer>
{/if}
