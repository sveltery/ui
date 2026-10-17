<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectRadarPoints } from '../state/selectors/radarSelectors.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import type { WithIdRequired } from '../util/useUniqueId.js';
  import type { InternalRadarProps, PropsWithDefaults } from './Radar.js';
  import RadarWithState from './RadarWithState.svelte';

  let props: WithIdRequired<PropsWithDefaults> & { children?: Snippet } = $props();

  const isPanorama = useIsPanorama();
  const radarPoints = useAppSelector((state) => selectRadarPoints(state, props.radiusAxisId, props.angleAxisId, isPanorama, props.id));
</script>

{#if radarPoints.current?.points != null}
  <RadarWithState {...props as InternalRadarProps} points={radarPoints.current.points} baseLinePoints={radarPoints.current.baseLinePoints} isRange={radarPoints.current.isRange} />
{/if}
