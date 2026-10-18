<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { interpolate } from '../util/DataUtils.js';
  import { useAnimationId } from '../util/useAnimationId.svelte.js';
  import JavascriptAnimate from '../animation/JavascriptAnimate.svelte';
  import { STABLE_EMPTY_ARRAY, type InternalProps, type RadialBarDataItem } from './RadialBar.js';
  import LabelListFromLabelProp from '../component/LabelListFromLabelProp.svelte';
  import type { ImplicitLabelListType } from '../component/LabelList.hooks.svelte.js';
  import RadialBarSectors from './RadialBarSectors.svelte';
  import RadialBarLabelListProvider from './RadialBarLabelListProvider.svelte';

  let { props }: { props: InternalProps & { children?: Snippet } } = $props();

  // Upstream's RenderSectors keeps the last animated sectors in a ref that this component writes during render.
  let previousSectors: ReadonlyArray<RadialBarDataItem> | null = null;

  const animationId = useAnimationId(() => ({ ...props }), 'recharts-radialbar-');
  let isAnimating = $state(false);

  // Upstream reads the ref when this component renders: on a new animation and when isAnimating flips, not on each frame.
  const prevData = $derived.by(() => {
    void animationId.current;
    void isAnimating;
    return previousSectors;
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

  function stepData(t: number): ReadonlyArray<RadialBarDataItem> | undefined {
    const { sectors } = props;
    const result: ReadonlyArray<RadialBarDataItem> | undefined =
      t === 1
        ? sectors
        : (sectors ?? STABLE_EMPTY_ARRAY).map((entry: RadialBarDataItem, index: number): RadialBarDataItem => {
            const prev = prevData && prevData[index];

            if (prev) {
              return {
                ...entry,
                startAngle: interpolate(prev.startAngle, entry.startAngle, t),
                endAngle: interpolate(prev.endAngle, entry.endAngle, t),
              };
            }
            const { endAngle, startAngle } = entry;

            return { ...entry, endAngle: interpolate(startAngle, endAngle, t) };
          });

    if (t > 0) {
      previousSectors = result ?? null;
    }
    return result;
  }
</script>

{#key animationId.current}
  <JavascriptAnimate
    animationId={animationId.current}
    begin={props.animationBegin}
    duration={props.animationDuration}
    isActive={props.isAnimationActive}
    easing={props.animationEasing}
    onAnimationStart={handleAnimationStart}
    onAnimationEnd={handleAnimationEnd}
  >
    {#snippet children(t)}
      {const sectors = $derived(stepData(t))}
      <RadialBarSectors sectors={sectors ?? STABLE_EMPTY_ARRAY} allOtherRadialBarProps={props} />
    {/snippet}
  </JavascriptAnimate>
{/key}
<!-- Upstream renders these inside each animation frame. Here they stay outside the keyed block, so a new animation does not remount the Cells, whose re-registration would start another animation. -->
<RadialBarLabelListProvider showLabels={!isAnimating} sectors={props.sectors ?? STABLE_EMPTY_ARRAY}>
  <LabelListFromLabelProp label={props.label as ImplicitLabelListType | undefined} />
  {@render props.children?.()}
</RadialBarLabelListProvider>
