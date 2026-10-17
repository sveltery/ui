<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { interpolate, isNan, isNullish, isNumber } from '../util/DataUtils.js';
  import { useAnimationId } from '../util/useAnimationId.svelte.js';
  import { useCartesianChartLayout } from '../context/chartLayoutContext.svelte.js';
  import type { BaseLineType } from '../shape/Curve.js';
  import type { AreaPointItem } from '../state/selectors/areaSelectors.js';
  import JavascriptAnimate from '../animation/JavascriptAnimate.svelte';
  import Layer from '../container/Layer.svelte';
  import LabelListFromLabelProp from '../component/LabelListFromLabelProp.svelte';
  import type { ImplicitLabelListType } from '../component/LabelList.hooks.svelte.js';
  import AreaLabelListProvider from './AreaLabelListProvider.svelte';
  import StaticArea from './StaticArea.svelte';
  import ClipRect from './ClipRect.svelte';
  import type { InternalProps } from './Area.js';

  let { needClip, clipPathId, props }: { needClip: boolean; clipPathId: string; props: InternalProps & { children?: Snippet } } = $props();

  // Upstream's RenderArea holds these refs; this component writes them during render and reads them on the next render.
  let previousPoints: ReadonlyArray<AreaPointItem> | null = null;
  let previousBaseline: BaseLineType | undefined;

  const animationId = useAnimationId(() => ({ points: props.points, baseLine: props.baseLine }), 'recharts-area-');
  const layout = useCartesianChartLayout();

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

  // Upstream reads the refs when this component renders: when a prop changes and when isAnimating flips, not on each frame.
  const prev = $derived.by(() => {
    void isAnimating;
    void Object.values(props);
    return { prevPoints: previousPoints, prevBaseLine: previousBaseline };
  });

  type Frame = { kind: 'step'; points: ReadonlyArray<AreaPointItem>; baseLine: BaseLineType } | { kind: 'clip' };

  function frame(t: number): Frame {
    const { points, baseLine } = props;
    const { prevPoints, prevBaseLine } = prev;
    if (prevPoints) {
      const prevPointsDiffFactor = prevPoints.length / points.length;
      const stepPoints: ReadonlyArray<AreaPointItem> =
        t === 1
          ? points
          : points.map((entry, index): AreaPointItem => {
              const prevPointIndex = Math.floor(index * prevPointsDiffFactor);
              if (prevPoints[prevPointIndex]) {
                const prev: AreaPointItem = prevPoints[prevPointIndex];

                return { ...entry, x: interpolate(prev.x, entry.x, t), y: interpolate(prev.y, entry.y, t) };
              }

              return entry;
            });
      let stepBaseLine: BaseLineType;

      if (isNumber(baseLine)) {
        stepBaseLine = interpolate(prevBaseLine, baseLine, t);
      } else if (isNullish(baseLine) || isNan(baseLine)) {
        stepBaseLine = interpolate(prevBaseLine, 0, t);
      } else {
        stepBaseLine = baseLine.map((entry, index) => {
          const prevPointIndex = Math.floor(index * prevPointsDiffFactor);
          if (Array.isArray(prevBaseLine) && prevBaseLine[prevPointIndex]) {
            const prev = prevBaseLine[prevPointIndex];

            return { ...entry, x: interpolate(prev.x, entry.x, t), y: interpolate(prev.y, entry.y, t) };
          }

          return entry;
        });
      }

      if (t > 0) {
        previousPoints = stepPoints;
        previousBaseline = stepBaseLine;
      }
      return { kind: 'step', points: stepPoints, baseLine: stepBaseLine };
    }

    if (t > 0) {
      previousPoints = points;
      previousBaseline = baseLine;
    }
    return { kind: 'clip' };
  }
</script>

{#if layout.current != null}
  {const currentLayout = layout.current}
  <AreaLabelListProvider {showLabels} points={props.points}>
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
          {const step = frame(t)}
          {#if step.kind === 'step'}
            <StaticArea points={step.points} baseLine={step.baseLine} {needClip} {clipPathId} {props} />
          {:else}
            <Layer>
              {#if props.isAnimationActive}
                <defs
                  ><clipPath id="animationClipPath-{clipPathId}"
                    ><ClipRect alpha={t} points={props.points} baseLine={props.baseLine} layout={currentLayout} strokeWidth={props.strokeWidth} /></clipPath
                  ></defs
                >
              {/if}
              <Layer clipPath="url(#animationClipPath-{clipPathId})">
                <StaticArea points={props.points} baseLine={props.baseLine} {needClip} {clipPathId} {props} />
              </Layer>
            </Layer>
          {/if}
        {/snippet}
      </JavascriptAnimate>
    {/key}
    <LabelListFromLabelProp label={props.label as ImplicitLabelListType | undefined} />
  </AreaLabelListProvider>
{/if}
