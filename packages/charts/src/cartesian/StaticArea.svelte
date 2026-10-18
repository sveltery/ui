<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import type { BaseLineType } from '../shape/Curve.js';
  import type { AreaPointItem } from '../state/selectors/areaSelectors.js';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents.js';
  import Layer from '../container/Layer.svelte';
  import Curve from '../shape/Curve.svelte';
  import Dots from '../component/Dots.svelte';
  import type { DotsDotProps } from '../component/Dots.js';
  import type { InternalProps } from './Area.js';

  let {
    points,
    baseLine,
    needClip,
    clipPathId,
    props,
  }: {
    points: ReadonlyArray<AreaPointItem>;
    baseLine: BaseLineType | undefined;
    needClip: boolean;
    clipPathId: string;
    props: InternalProps;
  } = $props();

  const propsWithoutId = $derived(omit(props, ['id']));
  const allOtherProps = $derived(svgPropertiesNoEvents(propsWithoutId));
  const propsWithEvents = $derived(svgPropertiesAndEvents(propsWithoutId));
  const areaProps: DotsDotProps = $derived(svgPropertiesNoEvents(propsWithoutId) as DotsDotProps);
</script>

{#snippet AreaDotsWrapper()}
  <Dots {points} dot={props.dot} className="recharts-area-dots" dotClassName="recharts-area-dot" dataKey={props.dataKey} baseProps={areaProps} needClip={props.needClip} {clipPathId} />
{/snippet}

{#if points?.length > 1}
  <Layer clipPath={needClip ? `url(#clipPath-${clipPathId})` : undefined}>
    <Curve
      {...propsWithEvents}
      id={props.id}
      {points}
      connectNulls={props.connectNulls}
      type={props.type}
      {baseLine}
      layout={props.layout}
      stroke="none"
      class="recharts-area-area"
    />
    {#if props.stroke !== 'none'}
      <Curve {...allOtherProps} class="recharts-area-curve" layout={props.layout} type={props.type} connectNulls={props.connectNulls} fill="none" {points} />
    {/if}
    {#if props.stroke !== 'none' && props.isRange && Array.isArray(baseLine)}
      <Curve {...allOtherProps} class="recharts-area-curve" layout={props.layout} type={props.type} connectNulls={props.connectNulls} fill="none" points={baseLine} />
    {/if}
  </Layer>
{/if}
{@render AreaDotsWrapper()}
