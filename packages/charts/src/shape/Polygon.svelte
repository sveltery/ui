<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { clsx } from 'clsx';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { attrs } from '../util/attrs.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import { getRanglePath, getSinglePolygonPath, type Props } from './Polygon.js';

  let raw: SvelteProps<Props> = $props();
  const resolved = rechartsProps<Props, object>(() => raw, {});

  const layerClass = $derived(clsx('recharts-polygon', resolved.className));
  const others = $derived(omit(resolved, ['points', 'className', 'baseLinePoints', 'connectNulls']));
  const hasStroke = $derived(others.stroke && others.stroke !== 'none');
  const rangePath = $derived(resolved.baseLinePoints && resolved.baseLinePoints.length && resolved.points ? getRanglePath(resolved.points, resolved.baseLinePoints, resolved.connectNulls) : '');
  const singlePath = $derived(resolved.points ? getSinglePolygonPath(resolved.points, resolved.connectNulls) : '');
</script>

{#if resolved.points && resolved.points.length}
  {#if resolved.baseLinePoints && resolved.baseLinePoints.length}
    <g class={layerClass}>
      <path {...attrs({ ...svgPropertiesAndEvents(others), fill: rangePath.slice(-1) === 'Z' ? others.fill : 'none', stroke: 'none', d: rangePath })} />
      {#if hasStroke}
        <path {...attrs({ ...svgPropertiesAndEvents(others), fill: 'none', d: singlePath })} />
      {/if}
      {#if hasStroke}
        <path {...attrs({ ...svgPropertiesAndEvents(others), fill: 'none', d: getSinglePolygonPath(resolved.baseLinePoints, resolved.connectNulls) })} />
      {/if}
    </g>
  {:else}
    <path {...attrs({ ...svgPropertiesAndEvents(others), fill: singlePath.slice(-1) === 'Z' ? others.fill : 'none', className: layerClass, d: singlePath })} />
  {/if}
{/if}
