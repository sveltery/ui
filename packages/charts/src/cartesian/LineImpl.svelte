<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { rechartsProps, type RechartsBag } from '../util/svelteProps.js';
  import type { WithIdRequired } from '../util/useUniqueId.js';
  import { usePlotArea } from '../hooks.svelte.js';
  import { useChartLayout } from '../context/chartLayoutContext.svelte.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectLinePoints } from '../state/selectors/lineSelectors.js';
  import { useNeedsClip } from './GraphicalItemClipPath.hooks.js';
  import { defaultLineProps, type InternalProps, type LinePointItem, type Props } from './Line.js';
  import LineWithState from './LineWithState.svelte';

  let raw: RechartsBag<WithIdRequired<Props>> = $props();
  const resolved = rechartsProps<WithIdRequired<Props>, typeof defaultLineProps>(() => raw, defaultLineProps);

  const clip = useNeedsClip(
    () => resolved.xAxisId,
    () => resolved.yAxisId,
  );
  const plotArea = usePlotArea();
  const layout = useChartLayout();
  const isPanorama = useIsPanorama();
  const points = useAppSelector((state): ReadonlyArray<LinePointItem> | undefined => selectLinePoints(state, resolved.xAxisId, resolved.yAxisId, isPanorama, resolved.id));

  const withState = $derived.by(() => {
    const currentLayout = layout.current;
    if ((currentLayout !== 'horizontal' && currentLayout !== 'vertical') || points.current == null || plotArea.current == null) {
      // Cannot render Line in an unsupported layout
      return null;
    }
    const { height, width, x: left, y: top } = plotArea.current;
    return { ...resolved, points: points.current, layout: currentLayout, height, width, left, top, needClip: clip.current.needClip } as unknown as InternalProps & { children?: Snippet };
  });
</script>

{#if withState}
  <LineWithState {...withState} />
{/if}
