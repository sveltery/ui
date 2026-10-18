<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { clsx } from 'clsx';
  import { polarToCartesian } from '../util/PolarUtils.js';
  import { adaptEventsOfChild, type BaseTickContentProps, type TickItem } from '../util/types.js';
  import { svgPropertiesNoEvents, svgPropertiesNoEventsFromUnknown } from '../util/svgPropertiesNoEvents.js';
  import { getClassNameFromUnknown } from '../util/getClassNameFromUnknown.js';
  import { attrs } from '../util/attrs.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectPolarViewBox } from '../state/selectors/polarAxisSelectors.js';
  import { selectPolarAngleAxisTicks, selectPolarAxisScale } from '../state/selectors/polarScaleSelectors.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import Layer from '../container/Layer.svelte';
  import Dot from '../shape/Dot.svelte';
  import Polygon from '../shape/Polygon.svelte';
  import Text from '../component/Text.svelte';
  import RenderProp from '../util/RenderProp.svelte';
  import { AXIS_TYPE, getTickLineCoord, getTickTextAnchor, getTickTextVerticalAnchor, type InternalPolarAngleAxisProps, type PropsWithDefaults } from './PolarAngleAxis.js';

  let defaultsAndInputs: PropsWithDefaults = $props();

  const viewBox = useAppSelector(selectPolarViewBox);
  const scale = useAppSelector((state) => selectPolarAxisScale(state, 'angleAxis', defaultsAndInputs.angleAxisId));
  const isPanorama = useIsPanorama();
  const ticks = useAppSelector((state) => selectPolarAngleAxisTicks(state, 'angleAxis', defaultsAndInputs.angleAxisId, isPanorama));

  const internal: InternalPolarAngleAxisProps | null = $derived.by(() => {
    if (viewBox.current == null || !ticks.current || !ticks.current.length || scale.current == null) {
      return null;
    }
    return {
      ...defaultsAndInputs,
      scale: scale.current,
      ...viewBox.current,
      radius: viewBox.current.outerRadius,
      ticks: ticks.current,
    } as InternalPolarAngleAxisProps;
  });
</script>

{#snippet AxisLine(props: InternalPolarAngleAxisProps)}
  {#if props.axisLine}
    {const axisLineProps = $derived({ className: 'recharts-polar-angle-axis-line', ...svgPropertiesNoEvents(props), fill: 'none', ...svgPropertiesNoEvents(props.axisLine) })}
    {#if props.axisLineType === 'circle'}
      <Dot {...axisLineProps} cx={props.cx} cy={props.cy} r={props.radius} />
    {:else}
      <Polygon {...axisLineProps} points={props.ticks.map((entry) => polarToCartesian(props.cx, props.cy, props.radius, entry.coordinate))} />
    {/if}
  {/if}
{/snippet}

{#snippet TickItemText(tick: InternalPolarAngleAxisProps['tick'], tickProps: BaseTickContentProps, value: string | number)}
  {#if typeof tick === 'function'}
    <RenderProp of={tick as never} props={tickProps} />
  {:else if tick}
    <Text {...tickProps} class="recharts-polar-angle-axis-tick-value" children={value} />
  {/if}
{/snippet}

{#snippet Ticks(props: InternalPolarAngleAxisProps)}
  {const axisProps = $derived(omit(svgPropertiesNoEvents(props) as Record<string, unknown>, ['ref']))}
  {const customTickProps = $derived(svgPropertiesNoEventsFromUnknown(props.tick))}
  {const tickLineProps = $derived({ ...axisProps, fill: 'none', ...svgPropertiesNoEvents(props.tickLine) })}
  <Layer class="recharts-polar-angle-axis-ticks">
    {#each props.ticks as entry, i (entry.coordinate)}
      {const lineCoord = $derived(getTickLineCoord(entry, props))}
      {const tickProps = $derived({
        ...axisProps,
        textAnchor: getTickTextAnchor(entry, props.orientation),
        verticalAnchor: getTickTextVerticalAnchor(entry),
        stroke: 'none',
        fill: props.stroke,
        ...customTickProps,
        index: i,
        payload: entry,
        x: lineCoord.x2,
        y: lineCoord.y2,
      } as BaseTickContentProps)}
      <Layer class={clsx('recharts-polar-angle-axis-tick', getClassNameFromUnknown(props.tick))} {...adaptEventsOfChild(props, entry as TickItem, i)}>
        {#if props.tickLine}
          <line {...attrs({ className: 'recharts-polar-angle-axis-tick-line', ...tickLineProps, ...lineCoord })} />
        {/if}
        {@render TickItemText(props.tick, tickProps, props.tickFormatter ? props.tickFormatter(entry.value, i) : entry.value)}
      </Layer>
    {/each}
  </Layer>
{/snippet}

{#if internal}
  <ZIndexLayer zIndex={internal.zIndex}>
    <Layer class={clsx('recharts-polar-angle-axis', AXIS_TYPE, internal.className)}>
      {@render AxisLine(internal)}
      {@render Ticks(internal)}
    </Layer>
  </ZIndexLayer>
{/if}
