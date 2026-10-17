<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import type { Snippet } from 'svelte';
  import { clsx } from 'clsx';
  import { polarToCartesian } from '../util/PolarUtils.js';
  import { adaptEventsOfChild, type TickItem } from '../util/types.js';
  import { svgPropertiesNoEvents, svgPropertiesNoEventsFromUnknown } from '../util/svgPropertiesNoEvents.js';
  import { getClassNameFromUnknown } from '../util/getClassNameFromUnknown.js';
  import { attrs } from '../util/attrs.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectPolarViewBox } from '../state/selectors/polarAxisSelectors.js';
  import { selectPolarAxisScale, selectPolarAxisTicks } from '../state/selectors/polarScaleSelectors.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import Layer from '../container/Layer.svelte';
  import Text from '../component/Text.svelte';
  import RenderProp from '../util/RenderProp.svelte';
  import PolarLabelContextProvider from '../component/PolarLabelContextProvider.svelte';
  import PolarLabelFromLabelProp from '../component/PolarLabelFromLabelProp.svelte';
  import type { ImplicitLabelType } from '../component/Label.hooks.svelte.js';
  import { AXIS_TYPE, getTickTextAnchor, getTickValueCoord, getViewBox, type InsideProps, type Props, type PropsWithDefaults } from './PolarRadiusAxis.js';

  let defaultsAndInputs: PropsWithDefaults & { children?: Snippet } = $props();

  const viewBox = useAppSelector(selectPolarViewBox);
  const scale = useAppSelector((state) => selectPolarAxisScale(state, 'radiusAxis', defaultsAndInputs.radiusAxisId));
  const ticks = useAppSelector((state) => selectPolarAxisTicks(state, 'radiusAxis', defaultsAndInputs.radiusAxisId, false));

  const internal: InsideProps | null = $derived(
    viewBox.current == null || !ticks.current || !ticks.current.length || scale.current == null
      ? null
      : ({ ...defaultsAndInputs, scale: scale.current, ...viewBox.current } as InsideProps),
  );
</script>

{#snippet AxisLine(props: InsideProps, ticks: ReadonlyArray<TickItem>)}
  {const axisLineProps = $derived.by(() => {
    const { cx, cy, angle, axisLine, ...others } = props;
    const extent: [number, number] = ticks.reduce(
      (result: [number, number], entry: TickItem): [number, number] => [Math.min(result[0], entry.coordinate), Math.max(result[1], entry.coordinate)],
      [Infinity, -Infinity],
    );
    const point0 = polarToCartesian(cx, cy, extent[0], angle);
    const point1 = polarToCartesian(cx, cy, extent[1], angle);
    return {
      ...svgPropertiesNoEvents(others),
      fill: 'none',
      ...svgPropertiesNoEvents(axisLine),
      x1: point0.x,
      y1: point0.y,
      x2: point1.x,
      y2: point1.y,
    };
  })}
  <line {...attrs({ className: 'recharts-polar-radius-axis-line', ...axisLineProps })} />
{/snippet}

{#snippet TickItem(option: Props['tick'], tickProps: Record<string, unknown>, value: string | number)}
  {#if typeof option === 'function'}
    <RenderProp of={option as never} props={tickProps} />
  {:else}
    <Text {...tickProps} class="recharts-polar-radius-axis-tick-value" children={value} />
  {/if}
{/snippet}

{#snippet Ticks(props: InsideProps, ticks: ReadonlyArray<TickItem>)}
  {const shared = $derived.by(() => {
    const others = omit(props, ['angle', 'tickFormatter', 'stroke', 'tick']);
    return { textAnchor: getTickTextAnchor(props.orientation), axisProps: svgPropertiesNoEvents(others), customTickProps: svgPropertiesNoEventsFromUnknown(props.tick) };
  })}
  <Layer class="recharts-polar-radius-axis-ticks">
    {#each ticks as entry, i (entry.coordinate)}
      {const coord = $derived(getTickValueCoord(entry, props.angle, props.cx, props.cy))}
      {const tickProps = $derived({
        textAnchor: shared.textAnchor,
        transform: `rotate(${90 - props.angle}, ${coord.x}, ${coord.y})`,
        ...shared.axisProps,
        stroke: 'none',
        fill: props.stroke,
        ...shared.customTickProps,
        index: i,
        ...coord,
        payload: entry,
      })}
      <Layer class={clsx('recharts-polar-radius-axis-tick', getClassNameFromUnknown(props.tick))} {...adaptEventsOfChild(props, entry, i)}>
        {@render TickItem(props.tick, tickProps, props.tickFormatter ? props.tickFormatter(entry.value, i) : entry.value)}
      </Layer>
    {/each}
  </Layer>
{/snippet}

{#if internal && ticks.current}
  <ZIndexLayer zIndex={internal.zIndex}>
    <Layer class={clsx('recharts-polar-radius-axis', AXIS_TYPE, internal.className)}>
      {#if internal.axisLine}
        {@render AxisLine(internal, ticks.current)}
      {/if}
      {#if internal.tick}
        {@render Ticks(internal, ticks.current)}
      {/if}
      <PolarLabelContextProvider {...getViewBox(internal.angle, internal.cx, internal.cy, ticks.current)}>
        <PolarLabelFromLabelProp label={internal.label as ImplicitLabelType | undefined} />
        {@render defaultsAndInputs.children?.()}
      </PolarLabelContextProvider>
    </Layer>
  </ZIndexLayer>
{/if}
