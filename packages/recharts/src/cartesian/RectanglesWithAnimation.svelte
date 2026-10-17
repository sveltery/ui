<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { interpolate } from '../util/DataUtils.js';
  import { useAnimationId } from '../util/useAnimationId.svelte.js';
  import JavascriptAnimate from '../animation/JavascriptAnimate.svelte';
  import Layer from '../container/Layer.svelte';
  import LabelListFromLabelProp from '../component/LabelListFromLabelProp.svelte';
  import type { ImplicitLabelListType } from '../component/LabelList.hooks.svelte.js';
  import BarLabelListProvider from './BarLabelListProvider.svelte';
  import BarRectangles from './BarRectangles.svelte';
  import type { BarRectangleItem, InternalProps } from './Bar.js';

  let { props }: { props: InternalProps & { children?: Snippet } } = $props();

  // Upstream's RenderRectangles keeps the last animated rectangles in a ref that this component writes during render.
  let previousRectangles: ReadonlyArray<BarRectangleItem> | null = null;

  const animationId = useAnimationId(() => ({ ...props }), 'recharts-bar-');

  let isAnimating = $state(false);
  const showLabels = $derived(!isAnimating);

  // Upstream reads the ref when this component renders: on a new animation and when isAnimating flips, not on each frame.
  const prevData = $derived.by(() => {
    void animationId.current;
    void isAnimating;
    return previousRectangles;
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

  function stepData(t: number): ReadonlyArray<BarRectangleItem> | undefined {
    const { data, layout } = props;
    const result =
      t === 1
        ? data
        : data?.map((entry: BarRectangleItem, index: number): BarRectangleItem => {
            const prev = prevData && prevData[index];

            if (prev) {
              return {
                ...entry,
                x: interpolate(prev.x, entry.x, t),
                y: interpolate(prev.y, entry.y, t),
                width: interpolate(prev.width, entry.width, t),
                height: interpolate(prev.height, entry.height, t),
              };
            }

            if (layout === 'horizontal') {
              const height = interpolate(0, entry.height, t);
              const y = interpolate(entry.stackedBarStart, entry.y, t);

              return {
                ...entry,
                y,
                height,
              };
            }

            const w = interpolate(0, entry.width, t);
            const x = interpolate(entry.stackedBarStart, entry.x, t);

            return { ...entry, width: w, x };
          });

    if (t > 0) {
      previousRectangles = result ?? null;
    }
    return result;
  }
</script>

<BarLabelListProvider {showLabels} rects={props.data}>
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
        {const data = $derived(stepData(t))}
        {#if data != null}
          <Layer><BarRectangles {props} {data} /></Layer>
        {/if}
      {/snippet}
    </JavascriptAnimate>
  {/key}
  <LabelListFromLabelProp label={props.label as ImplicitLabelListType | undefined} />
  {@render props.children?.()}
</BarLabelListProvider>
