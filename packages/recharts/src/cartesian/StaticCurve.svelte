<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import type { Ref } from '../react.js';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents.js';
  import Shape from '../util/Shape.svelte';
  import Dots from '../component/Dots.svelte';
  import type { DotsDotProps } from '../component/Dots.js';
  import type { InternalProps, LinePointItem } from './Line.js';

  let {
    clipPathId,
    pathRef,
    points,
    strokeDasharray,
    props,
  }: {
    clipPathId: string;
    pathRef: Ref<SVGPathElement>;
    points: ReadonlyArray<LinePointItem>;
    props: InternalProps;
    strokeDasharray?: string;
  } = $props();

  const curveProps = $derived.by(() => {
    const { type, layout, connectNulls, needClip } = props;
    const others = omit(props, ['type', 'layout', 'connectNulls', 'needClip', 'shape']);
    return {
      ...svgPropertiesAndEvents(others),
      fill: 'none',
      className: 'recharts-line-curve',
      clipPath: needClip ? `url(#clipPath-${clipPathId})` : undefined,
      points,
      type,
      layout,
      connectNulls,
      strokeDasharray: strokeDasharray ?? props.strokeDasharray,
    };
  });

  const lineProps = $derived(svgPropertiesNoEvents(omit(props, ['id'])) as DotsDotProps);
</script>

{#snippet LineDotsWrapper()}
  <Dots {points} dot={props.dot} className="recharts-line-dots" dotClassName="recharts-line-dot" dataKey={props.dataKey} baseProps={lineProps} needClip={props.needClip} {clipPathId} />
{/snippet}

{#if points?.length > 1}
  <Shape shapeType="curve" option={props.shape} {...curveProps} {pathRef} />
{/if}
{@render LineDotsWrapper()}
