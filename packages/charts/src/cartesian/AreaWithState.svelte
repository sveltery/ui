<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { clsx } from 'clsx';
  import Layer from '../container/Layer.svelte';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import ActivePoints from '../component/ActivePoints.svelte';
  import { getRadiusAndStrokeWidthFromDot } from '../util/getRadiusAndStrokeWidthFromDot.js';
  import { isClipDot } from '../util/ReactUtils.js';
  import GraphicalItemClipPath from './GraphicalItemClipPath.svelte';
  import AreaWithAnimation from './AreaWithAnimation.svelte';
  import { getLegendItemColor, type InternalProps } from './Area.js';

  let props: InternalProps & { children?: Snippet } = $props();

  const clipPathId = $derived(props.id);
  const radiusAndStrokeWidth = $derived(getRadiusAndStrokeWidthFromDot(props.dot));
  const clipDot = $derived(isClipDot(props.dot));
  const dotSize = $derived(radiusAndStrokeWidth.r * 2 + radiusAndStrokeWidth.strokeWidth);
  const activePointsClipPath = $derived(props.needClip ? `url(#clipPath-${clipDot ? '' : 'dots-'}${clipPathId})` : undefined);
</script>

{#if !props.hide}
  <ZIndexLayer zIndex={props.zIndex}>
    <Layer class={clsx('recharts-area', props.className)}>
      {#if props.needClip}
        <defs
          ><GraphicalItemClipPath {clipPathId} xAxisId={props.xAxisId} yAxisId={props.yAxisId} />{#if !clipDot}<clipPath id="clipPath-dots-{clipPathId}"
              ><rect x={props.left - dotSize / 2} y={props.top - dotSize / 2} width={props.width + dotSize} height={props.height + dotSize} /></clipPath
            >{/if}</defs
        >
      {/if}
      <AreaWithAnimation needClip={props.needClip} {clipPathId} {props} />
    </Layer>
    <ActivePoints points={props.points} mainColor={getLegendItemColor(props.stroke, props.fill)} itemDataKey={props.dataKey} activeDot={props.activeDot} clipPath={activePointsClipPath} />
    {#if props.isRange && Array.isArray(props.baseLine)}
      <ActivePoints points={props.baseLine} mainColor={getLegendItemColor(props.stroke, props.fill)} itemDataKey={props.dataKey} activeDot={props.activeDot} clipPath={activePointsClipPath} />
    {/if}
  </ZIndexLayer>
{/if}
