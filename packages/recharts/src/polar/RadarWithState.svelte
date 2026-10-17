<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { clsx } from 'clsx';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import Layer from '../container/Layer.svelte';
  import ActivePoints from '../component/ActivePoints.svelte';
  import { getLegendItemColor, type InternalRadarProps } from './Radar.js';
  import PolygonWithAnimation from './PolygonWithAnimation.svelte';

  let props: InternalRadarProps & { children?: Snippet } = $props();
</script>

{#if !props.hide}
  <ZIndexLayer zIndex={props.zIndex}>
    <Layer class={clsx('recharts-radar', props.className)}>
      <PolygonWithAnimation {props} />
    </Layer>
    <ActivePoints points={props.points} mainColor={getLegendItemColor(props.stroke, props.fill)} itemDataKey={props.dataKey} activeDot={props.activeDot} />
  </ZIndexLayer>
{/if}
