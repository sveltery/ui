<svelte:options namespace="svg" />

<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import { clsx } from 'clsx';
  import get from 'es-toolkit/compat/get';
  import type { SVGProps } from '../react.js';
  import { adaptEventsOfChild, type CartesianTickItem, type PresentationAttributesAdaptChildEvent } from '../util/types.js';
  import { svgPropertiesNoEvents, svgPropertiesNoEventsFromUnknown } from '../util/svgPropertiesNoEvents.js';
  import { getClassNameFromUnknown } from '../util/getClassNameFromUnknown.js';
  import { attrs } from '../util/attrs.js';
  import type { AxisId } from '../state/cartesianAxisSlice.js';
  import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import Layer from '../container/Layer.svelte';
  import RenderProp from '../util/RenderProp.svelte';
  import Text from '../component/Text.svelte';
  import { isValidTextAnchor, type TextAnchor } from '../component/Text.js';
  import { getTicks } from './getTicks.js';
  import { getTickLineCoord, getTickTextAnchor, getTickVerticalAnchor, type Orientation, type Props } from './CartesianAxis.js';
  import RenderedTicksReporter from './RenderedTicksReporter.svelte';

  type TicksProps = {
    axisType: 'xAxis' | 'yAxis' | undefined;
    events: Omit<PresentationAttributesAdaptChildEvent<unknown, SVGElement>, 'scale' | 'viewBox'>;
    fontSize: string;
    getTicksConfig: Omit<Props, 'ticks' | 'ref'>;
    height: number;
    letterSpacing: string;
    mirror: boolean;
    orientation: Orientation;
    padding?: Props['padding'];
    stroke?: Props['stroke'];
    tick?: Props['tick'];
    tickFormatter?: Props['tickFormatter'];
    tickLine?: Props['tickLine'];
    tickMargin: number;
    tickSize: number;
    tickTextProps?: Props['tickTextProps'];
    ticks?: ReadonlyArray<CartesianTickItem>;
    unit?: Props['unit'];
    width: number;
    x: number;
    y: number;
    axisId: AxisId | undefined;
    /** Upstream forwards a ref to the tick labels' group; CartesianAxis measures the tick font from it. */
    layerRef?: Attachment<SVGGElement>;
  };

  let props: TicksProps = $props();

  const finalTicks = $derived(getTicks({ ...props.getTicksConfig, ticks: props.ticks ?? [] } as Parameters<typeof getTicks>[0], props.fontSize, props.letterSpacing));
  const axisProps = $derived(svgPropertiesNoEvents(props.getTicksConfig));
  const customTickProps = $derived(svgPropertiesNoEventsFromUnknown(props.tick));
  // A textAnchor prop wins over the one the orientation implies.
  const textAnchor: TextAnchor = $derived(isValidTextAnchor(axisProps.textAnchor) ? axisProps.textAnchor : getTickTextAnchor(props.orientation, props.mirror));
  const verticalAnchor = $derived(getTickVerticalAnchor(props.orientation, props.mirror));
  const tickLineProps: SVGProps<SVGLineElement> = $derived({ ...axisProps, fill: 'none', ...(typeof props.tickLine === 'object' ? props.tickLine : {}) });

  const tickLineCoords = $derived(
    finalTicks.map((entry: CartesianTickItem) => ({
      entry,
      ...getTickLineCoord(entry, props.x, props.y, props.width, props.height, props.orientation, props.tickSize, props.mirror, props.tickMargin),
    })),
  );

  const tickLabels = $derived(
    tickLineCoords.map(({ entry, tick: tickCoord }, i) => {
      const { tickFormatter, padding, tickTextProps, stroke, unit } = props;
      const tickProps = {
        verticalAnchor,
        ...axisProps,
        textAnchor,
        stroke: 'none',
        fill: stroke,
        ...tickCoord,
        index: i,
        payload: entry,
        visibleTicksCount: finalTicks.length,
        tickFormatter,
        padding,
        ...tickTextProps,
        angle: tickTextProps?.angle ?? axisProps.angle ?? 0,
      };
      return {
        events: adaptEventsOfChild(props.events, entry, i),
        tickProps: { ...tickProps, ...customTickProps },
        value: `${typeof tickFormatter === 'function' ? tickFormatter(entry.value, i) : entry.value}${unit || ''}`,
      };
    }),
  );
</script>

{#snippet TickItem(option: Props['tick'], tickProps: Record<string, unknown>, value: string)}
  {const combinedClassName = $derived(clsx(tickProps.className as string | undefined, 'recharts-cartesian-axis-tick-value'))}
  {#if typeof option === 'function'}
    <RenderProp of={option as never} props={{ ...tickProps, className: combinedClassName }} />
  {:else}
    <Text {...tickProps} class={typeof option !== 'boolean' ? clsx('recharts-cartesian-axis-tick-value', getClassNameFromUnknown(option)) : 'recharts-cartesian-axis-tick-value'} children={value} />
  {/if}
{/snippet}

<g class="recharts-cartesian-axis-ticks recharts-{props.axisType}-ticks">
  <RenderedTicksReporter ticks={finalTicks} axisId={props.axisId} axisType={props.axisType} />
  {#if tickLabels.length > 0}
    <ZIndexLayer zIndex={DefaultZIndexes.label}>
      <g class="recharts-cartesian-axis-tick-labels recharts-{props.axisType}-tick-labels" {@attach props.layerRef}>
        {#each tickLabels as label, i (i)}
          <Layer class="recharts-cartesian-axis-tick-label" {...label.events}>
            {#if props.tick}
              {@render TickItem(props.tick, label.tickProps, label.value)}
            {/if}
          </Layer>
        {/each}
      </g>
    </ZIndexLayer>
  {/if}
  {#if tickLineCoords.length > 0}
    <g class="recharts-cartesian-axis-tick-lines recharts-{props.axisType}-tick-lines">
      {#each tickLineCoords as { line: lineCoord }, i (i)}
        <Layer class="recharts-cartesian-axis-tick">
          {#if props.tickLine}
            <line {...attrs({ ...tickLineProps, ...lineCoord, className: clsx('recharts-cartesian-axis-tick-line', get(props.tickLine, 'className')) })} />
          {/if}
        </Layer>
      {/each}
    </g>
  {/if}
</g>
