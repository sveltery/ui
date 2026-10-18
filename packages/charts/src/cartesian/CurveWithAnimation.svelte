<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { interpolate } from '../util/DataUtils.js';
  import { useAnimationId } from '../util/useAnimationId.svelte.js';
  import JavascriptAnimate from '../animation/JavascriptAnimate.svelte';
  import LabelListFromLabelProp from '../component/LabelListFromLabelProp.svelte';
  import type { ImplicitLabelListType } from '../component/LabelList.hooks.svelte.js';
  import LineLabelListProvider from './LineLabelListProvider.svelte';
  import StaticCurve from './StaticCurve.svelte';
  import { generateSimpleStrokeDasharray, getStrokeDasharray, getTotalLength, type InternalProps, type LinePointItem } from './Line.js';

  let { clipPathId, props }: { clipPathId: string; props: InternalProps & { children?: Snippet } } = $props();

  // Upstream's RenderCurve holds these refs; this component writes them during render and reads them on the next render.
  let previousPoints: ReadonlyArray<LinePointItem> | null = null;
  let longestAnimatedLength = 0;
  const pathRef: { current: SVGPathElement | null } = { current: null };

  const animationId = useAnimationId(() => ({ points: props.points }), 'recharts-line-');
  let animationIdRef = animationId.current;
  let startingPointRef = 0;

  let isAnimating = $state(false);
  const showLabels = $derived(!isAnimating);

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

  // Upstream measures the path and reads its refs when this component renders: when a prop changes and when isAnimating flips.
  const rendered = $derived.by(() => {
    void isAnimating;
    void Object.values(props);
    const id = animationId.current;
    const totalLength = getTotalLength(pathRef.current);
    // An update animation starts from the longest length any earlier animation reached.
    if (animationIdRef !== id) {
      startingPointRef = longestAnimatedLength;
      animationIdRef = id;
    }
    return { prevPoints: previousPoints, totalLength, startingPoint: startingPointRef };
  });

  function frame(t: number): { points: ReadonlyArray<LinePointItem>; strokeDasharray: string | undefined } {
    const { points, strokeDasharray, isAnimationActive, animateNewValues, width, height } = props;
    const { prevPoints, totalLength, startingPoint } = rendered;
    const lengthInterpolated = interpolate(startingPoint, totalLength + startingPoint, t);
    const curLength = Math.min(lengthInterpolated, totalLength);
    let currentStrokeDasharray;
    if (isAnimationActive) {
      if (strokeDasharray) {
        const lines = `${strokeDasharray}`.split(/[,\s]+/gim).map((num) => parseFloat(num));
        currentStrokeDasharray = getStrokeDasharray(curLength, totalLength, lines);
      } else {
        currentStrokeDasharray = generateSimpleStrokeDasharray(totalLength, curLength);
      }
    } else {
      currentStrokeDasharray = strokeDasharray == null ? undefined : String(strokeDasharray);
    }

    // Before the path has a length there is nothing to animate yet, so the refs keep their values.
    if (t > 0 && totalLength > 0) {
      previousPoints = points;
      // The longest length so far, so the next animation can start from it.
      longestAnimatedLength = Math.max(longestAnimatedLength, curLength);
    }

    if (prevPoints) {
      const prevPointsDiffFactor = prevPoints.length / points.length;
      const stepData =
        t === 1
          ? points
          : points.map((entry, index): LinePointItem => {
              const prevPointIndex = Math.floor(index * prevPointsDiffFactor);
              if (prevPoints[prevPointIndex]) {
                const prev = prevPoints[prevPointIndex];
                return {
                  ...entry,
                  x: interpolate(prev.x, entry.x, t),
                  y: interpolate(prev.y, entry.y, t),
                };
              }

              // magic number of faking previous x and y location
              if (animateNewValues) {
                return {
                  ...entry,
                  x: interpolate(width * 2, entry.x, t),
                  y: interpolate(height / 2, entry.y, t),
                };
              }
              return {
                ...entry,
                x: entry.x,
                y: entry.y,
              };
            });
      previousPoints = stepData;
      return { points: stepData, strokeDasharray: currentStrokeDasharray };
    }
    return { points, strokeDasharray: currentStrokeDasharray };
  }
</script>

<LineLabelListProvider points={props.points} {showLabels}>
  {@render props.children?.()}
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
        {const step = $derived(frame(t))}
        <StaticCurve {props} points={step.points} {clipPathId} {pathRef} strokeDasharray={step.strokeDasharray} />
      {/snippet}
    </JavascriptAnimate>
  {/key}
  <LabelListFromLabelProp label={props.label as ImplicitLabelListType | undefined} />
</LineLabelListProvider>
