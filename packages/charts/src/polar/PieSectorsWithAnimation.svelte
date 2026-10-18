<svelte:options namespace="svg" />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import get from 'es-toolkit/compat/get';
  import { interpolate } from '../util/DataUtils.js';
  import { useAnimationId } from '../util/useAnimationId.svelte.js';
  import JavascriptAnimate from '../animation/JavascriptAnimate.svelte';
  import Layer from '../container/Layer.svelte';
  import type { GraphicalItemId } from '../state/graphicalItemsSlice.js';
  import type { InternalProps, PieSectorDataItem } from './Pie.js';
  import PieLabelListProvider from './PieLabelListProvider.svelte';
  import PieSectors from './PieSectors.svelte';
  import PieLabelList from './PieLabelList.svelte';

  type WithoutId<T> = Omit<T, 'id'>;

  let {
    props,
    previousSectorsRef,
    id,
  }: { props: WithoutId<InternalProps> & { children?: Snippet }; previousSectorsRef: { current: ReadonlyArray<PieSectorDataItem> | null }; id: GraphicalItemId } = $props();

  const animationId = useAnimationId(() => ({ ...props }), 'recharts-pie-');

  let isAnimating = $state(false);

  // Upstream reads the ref when this component renders: on a new animation and when isAnimating flips, not on each frame.
  const prevSectors = $derived.by(() => {
    void animationId.current;
    void isAnimating;
    return previousSectorsRef.current;
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

  function stepData(t: number): PieSectorDataItem[] {
    const { sectors } = props;
    const result: PieSectorDataItem[] = [];
    const first: PieSectorDataItem | undefined = sectors && sectors[0];
    let curAngle: number = first?.startAngle ?? 0;

    sectors?.forEach((entry, index) => {
      const prev = prevSectors && prevSectors[index];
      const paddingAngle = index > 0 ? get(entry, 'paddingAngle', 0) : 0;

      if (prev) {
        const angle = interpolate(prev.endAngle - prev.startAngle, entry.endAngle - entry.startAngle, t);
        const latest = {
          ...entry,
          startAngle: curAngle + paddingAngle,
          endAngle: curAngle + angle + paddingAngle,
        };

        result.push(latest);
        curAngle = latest.endAngle;
      } else {
        const { endAngle, startAngle } = entry;
        const deltaAngle = interpolate(0, endAngle - startAngle, t);
        const latest = {
          ...entry,
          startAngle: curAngle + paddingAngle,
          endAngle: curAngle + deltaAngle + paddingAngle,
        };

        result.push(latest);
        curAngle = latest.endAngle;
      }
    });

    previousSectorsRef.current = result;
    return result;
  }
</script>

<PieLabelListProvider showLabels={!isAnimating} sectors={props.sectors}>
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
        <Layer>
          <PieSectors {sectors} activeShape={props.activeShape} inactiveShape={props.inactiveShape} allOtherPieProps={props} shape={props.shape} {id} />
        </Layer>
      {/snippet}
    </JavascriptAnimate>
  {/key}
  <PieLabelList showLabels={!isAnimating} sectors={props.sectors} {props} />
  {@render props.children?.()}
</PieLabelListProvider>
