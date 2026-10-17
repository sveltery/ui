<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { useAnimationId } from '../util/useAnimationId.svelte.js';
  import JavascriptAnimate from '../animation/JavascriptAnimate.svelte';
  import LabelListFromLabelProp from '../component/LabelListFromLabelProp.svelte';
  import type { ImplicitLabelListType } from '../component/LabelList.hooks.svelte.js';
  import { interpolatePolarPoint, type InternalRadarProps, type RadarPoint } from './Radar.js';
  import RadarLabelListProvider from './RadarLabelListProvider.svelte';
  import StaticPolygon from './StaticPolygon.svelte';

  let { props }: { props: InternalRadarProps & { children?: Snippet } } = $props();

  // Upstream's RenderPolygon keeps the last animated points in refs that this component writes during render.
  let previousPoints: ReadonlyArray<RadarPoint> | undefined = undefined;
  let previousBaseLinePoints: ReadonlyArray<RadarPoint> | undefined = undefined;

  const animationId = useAnimationId(() => ({ ...props }), 'recharts-radar-');
  let isAnimating = $state(false);
  const showLabels = $derived(!isAnimating);

  // Upstream reads the refs when this component renders: on a new animation and when isAnimating flips, not on each frame.
  const prev = $derived.by(() => {
    void animationId.current;
    void isAnimating;
    const prevPoints = previousPoints;
    const prevBaseLinePoints = previousBaseLinePoints;
    return {
      prevPoints,
      prevBaseLinePoints,
      prevPointsDiffFactor: prevPoints ? prevPoints.length / props.points.length : 1,
      prevBaseLinePointsDiffFactor: prevBaseLinePoints ? prevBaseLinePoints.length / props.baseLinePoints.length : 1,
    };
  });

  const handleAnimationEnd = () => {
    if (typeof props.onAnimationEnd === 'function') {
      props.onAnimationEnd();
    }
    isAnimating = false;
  };

  const handleAnimationStart = () => {
    if (typeof props.onAnimationStart === 'function') {
      props.onAnimationStart();
    }
    isAnimating = true;
  };

  function step(t: number) {
    const { points, baseLinePoints } = props;
    const { prevPoints, prevBaseLinePoints, prevPointsDiffFactor, prevBaseLinePointsDiffFactor } = prev;
    const stepData = t === 1 ? points : points.map(interpolatePolarPoint(prevPoints, prevPointsDiffFactor, t));
    const stepBaseLinePoints = t === 1 ? baseLinePoints : baseLinePoints?.map(interpolatePolarPoint(prevBaseLinePoints, prevBaseLinePointsDiffFactor, t));
    if (t > 0) {
      previousPoints = stepData;
      previousBaseLinePoints = stepBaseLinePoints;
    }
    return { stepData, stepBaseLinePoints };
  }
</script>

<RadarLabelListProvider {showLabels} points={props.points}>
  {#key animationId.current}
    <JavascriptAnimate
      animationId={animationId.current}
      begin={props.animationBegin}
      duration={props.animationDuration}
      isActive={props.isAnimationActive}
      easing={props.animationEasing}
      onAnimationEnd={handleAnimationEnd}
      onAnimationStart={handleAnimationStart}
    >
      {#snippet children(t)}
        {const frame = $derived(step(t))}
        <StaticPolygon points={frame.stepData} baseLinePoints={frame.stepBaseLinePoints} {props} />
      {/snippet}
    </JavascriptAnimate>
  {/key}
  <LabelListFromLabelProp label={props.label as ImplicitLabelListType | undefined} />
  {@render props.children?.()}
</RadarLabelListProvider>
